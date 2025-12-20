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

// Get Cloudflare context based on environment - THIS IS THE KEY!
async function getCloudflareCtx() {
  if (isCLI || isBuild || !isProduction) {
    // Development, Build or CLI: use wrangler proxy with local bindings
    const wrangler = await import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`)
    return wrangler.getPlatformProxy({
      environment: process.env.CLOUDFLARE_ENV,
      persist: true, // Use local persistence
    } satisfies GetPlatformProxyOptions)
  } else {
    // Production runtime: use OpenNext context with async mode
    return getCloudflareContext({ async: true })
  }
}

const cloudflare = await getCloudflareCtx()

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