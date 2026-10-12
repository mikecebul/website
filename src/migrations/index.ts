import * as migration_20241218_025953_migration from './20241218_025953_migration'
import * as migration_20261011_213804_v4_media_variants from './20261011_213804_v4_media_variants'

export const migrations = [
  {
    up: migration_20241218_025953_migration.up,
    down: migration_20241218_025953_migration.down,
    name: '20241218_025953_migration',
  },
  {
    up: migration_20261011_213804_v4_media_variants.up,
    down: migration_20261011_213804_v4_media_variants.down,
    name: '20261011_213804_v4_media_variants',
  },
]
