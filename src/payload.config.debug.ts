import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

// Collections
import { Inventory } from './collections/Inventory'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isCLI = process.argv.some((value) => value.match(/^(generate|migrate):?/))
const isProduction = process.env.NODE_ENV === 'production'
const isBuild = process.argv.some((value) => value.includes('next build'))

// Debug logging
console.log('🔍 Payload Config Debug:', {
  isCLI,
  isProduction,
  isBuild,
  nodeEnv: process.env.NODE_ENV,
  cfEnv: process.env.CLOUDFLARE_ENV,
})

// Get Cloudflare context based on environment with better error handling
async function getCloudflareCtx() {
  try {
    if (isCLI || isBuild || !isProduction) {
      console.log('📦 Using Wrangler proxy for local development')
      // Development, Build or CLI: use wrangler proxy with local bindings
      const wrangler = await import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`)
      const proxy = await wrangler.getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        persist: true, // Use local persistence
      } satisfies GetPlatformProxyOptions)

      console.log('✅ Wrangler proxy initialized:', {
        hasD1: !!proxy.env.D1,
        hasR2: !!proxy.env.R2,
        envKeys: Object.keys(proxy.env || {}),
      })

      return proxy
    } else {
      console.log('☁️ Using Cloudflare Workers context')
      // Production runtime: use OpenNext context with async mode
      const ctx = await getCloudflareContext({ async: true })

      console.log('✅ Cloudflare context initialized:', {
        hasD1: !!ctx.env.D1,
        hasR2: !!ctx.env.R2,
        envKeys: Object.keys(ctx.env || {}),
      })

      return ctx
    }
  } catch (error) {
    console.error('❌ Failed to initialize Cloudflare context:', {
      error: error.message,
      stack: error.stack,
      isCLI,
      isProduction,
      isBuild,
    })
    throw error
  }
}

// Initialize Cloudflare context
let cloudflare: any
try {
  cloudflare = await getCloudflareCtx()
} catch (error) {
  console.error('❌ Critical: Failed to get Cloudflare context')
  throw error
}

// Verify bindings exist
if (!cloudflare?.env?.D1) {
  console.error('❌ Critical: D1 binding not found in Cloudflare environment')
  console.error('Available env keys:', Object.keys(cloudflare?.env || {}))
  throw new Error('D1 binding missing')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Register all collections
  collections: [Pages, Posts, Inventory, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})