import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { r2Storage } from '@payloadcms/storage-r2'

// Collections
import { Inventory } from './collections/Inventory'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({
    binding: 'D1' as any,
  }),
  plugins: [
    r2Storage({
      bucket: 'R2' as any,
      collections: { media: true },
    }),
  ],
})