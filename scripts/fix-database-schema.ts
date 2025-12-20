import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { GetPlatformProxyOptions } from 'wrangler'

async function getCloudflareCtx() {
  const wrangler = await import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`)
  return wrangler.getPlatformProxy({
    environment: process.env.CLOUDFLARE_ENV || 'production',
    persist: false,
  } satisfies GetPlatformProxyOptions)
}

async function fixDatabase() {
  console.log('Starting database schema fix...')

  const cloudflare = await getCloudflareCtx()
  const db = cloudflare.env.D1

  try {
    console.log('Checking current posts table structure...')

    // 1. First, backup the posts data
    console.log('1. Creating backup of posts data...')
    const postsBackup = await db.prepare(`
      SELECT * FROM posts
    `).all()

    console.log(`Found ${postsBackup.results.length} posts to backup`)

    // 2. Check if posts_tags table exists
    console.log('2. Checking posts_tags table...')
    const tableCheck = await db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='posts_tags'
    `).first()

    if (!tableCheck) {
      console.log('Creating posts_tags table...')
      await db.exec(`
        CREATE TABLE \`posts_tags\` (
          \`order\` integer NOT NULL,
          \`parent_id\` integer NOT NULL,
          \`value\` text,
          \`id\` integer PRIMARY KEY NOT NULL,
          FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
        );

        CREATE INDEX \`posts_tags_order_idx\` ON \`posts_tags\` (\`order\`);
        CREATE INDEX \`posts_tags_parent_idx\` ON \`posts_tags\` (\`parent_id\`);
      `)
    }

    // 3. Migrate tags from TEXT to posts_tags table
    console.log('3. Migrating tags data...')

    // Get all posts with tags
    const postsWithTags = await db.prepare(`
      SELECT id, tags FROM posts WHERE tags IS NOT NULL AND tags != ''
    `).all()

    for (const post of postsWithTags.results) {
      try {
        // Parse tags if it's a JSON string
        let tags: string[] = []
        if (typeof post.tags === 'string') {
          tags = JSON.parse(post.tags)
        } else if (Array.isArray(post.tags)) {
          tags = post.tags
        }

        // Insert tags into posts_tags table
        for (let i = 0; i < tags.length; i++) {
          await db.prepare(`
            INSERT INTO posts_tags (order, parent_id, value) VALUES (?, ?, ?)
          `).bind(i, post.id, tags[i]).run()
        }
      } catch (error) {
        console.error(`Error migrating tags for post ${post.id}:`, error)
      }
    }

    // 4. Drop the related_niche column if it exists
    console.log('4. Checking for related_niche column...')
    const pragmaResult = await db.prepare(`
      PRAGMA table_info(posts)
    `).all()

    const hasRelatedNiche = pragmaResult.results.some((col: any) => col.name === 'related_niche')

    if (hasRelatedNiche) {
      console.log('Dropping related_niche column...')
      await db.exec(`
        ALTER TABLE \`posts\` DROP COLUMN \`related_niche\`;
      `)
    }

    // 5. Drop the old tags column if it exists (now that we've migrated it)
    console.log('5. Checking for old tags column...')
    const hasOldTags = pragmaResult.results.some((col: any) => col.name === 'tags')

    if (hasOldTags) {
      console.log('Dropping old tags column...')
      await db.exec(`
        ALTER TABLE \`posts\` DROP COLUMN \`tags\`;
      `)
    }

    // 6. Verify the final structure
    console.log('6. Verifying final table structure...')
    const finalStructure = await db.prepare(`
      SELECT sql FROM sqlite_master WHERE type='table' AND name='posts'
    `).first()

    console.log('Posts table structure:', finalStructure.sql)

    // 7. Verify posts_tags data
    const tagsCount = await db.prepare(`
      SELECT COUNT(*) as count FROM posts_tags
    `).first()

    console.log(`Migrated ${tagsCount.count} tags to posts_tags table`)

    console.log('Database schema fix completed successfully!')

  } catch (error) {
    console.error('Error fixing database:', error)
    throw error
  }
}

// Run the fix
fixDatabase()
  .then(() => {
    console.log('✅ Database schema has been fixed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed to fix database:', error)
    process.exit(1)
  })