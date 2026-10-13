import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` ADD \`headshot_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`users_headshot_idx\` ON \`users\` (\`headshot_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`users_headshot_idx\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`headshot_id\`;`)
}
