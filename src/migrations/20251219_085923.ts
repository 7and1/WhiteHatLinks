import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`posts_tags\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_tags_order_idx\` ON \`posts_tags\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`posts_tags_parent_idx\` ON \`posts_tags\` (\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`related_niche\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`posts_tags\`;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`related_niche\` text;`)
}
