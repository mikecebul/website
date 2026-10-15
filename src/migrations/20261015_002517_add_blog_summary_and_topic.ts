import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`summary\` text;`)
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`topic\` text;`)
  await db.run(sql`ALTER TABLE \`_blogs_v\` ADD \`version_summary\` text;`)
  await db.run(sql`ALTER TABLE \`_blogs_v\` ADD \`version_topic\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`blogs\` DROP COLUMN \`summary\`;`)
  await db.run(sql`ALTER TABLE \`blogs\` DROP COLUMN \`topic\`;`)
  await db.run(sql`ALTER TABLE \`_blogs_v\` DROP COLUMN \`version_summary\`;`)
  await db.run(sql`ALTER TABLE \`_blogs_v\` DROP COLUMN \`version_topic\`;`)
}
