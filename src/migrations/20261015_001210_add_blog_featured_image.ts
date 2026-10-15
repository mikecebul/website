import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`featured_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`blogs_featured_image_idx\` ON \`blogs\` (\`featured_image_id\`);`)
  await db.run(
    sql`ALTER TABLE \`_blogs_v\` ADD \`version_featured_image_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`_blogs_v_version_version_featured_image_idx\` ON \`_blogs_v\` (\`version_featured_image_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`blogs_featured_image_idx\`;`)
  await db.run(sql`DROP INDEX \`_blogs_v_version_version_featured_image_idx\`;`)
  await db.run(sql`ALTER TABLE \`blogs\` DROP COLUMN \`featured_image_id\`;`)
  await db.run(sql`ALTER TABLE \`_blogs_v\` DROP COLUMN \`version_featured_image_id\`;`)
}
