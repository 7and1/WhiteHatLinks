import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // This migration has been applied manually via fix-database-schema.ts
  // Adding it for version control purposes

  // The posts_tags table has been created
  // The related_niche column has been dropped from posts
  // The tags column has been dropped from posts (data migrated to posts_tags)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Drop posts_tags table
  await db.run(sql`DROP TABLE IF EXISTS \`posts_tags\`;`)

  // Add back the related_niche and tags columns
  await db.run(sql`ALTER TABLE \`posts\` ADD \`related_niche\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`tags\` TEXT;`)
}