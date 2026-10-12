import * as migration_20261012_022841_initial_sqlite from './20261012_022841_initial_sqlite'

export const migrations = [
  {
    up: migration_20261012_022841_initial_sqlite.up,
    down: migration_20261012_022841_initial_sqlite.down,
    name: '20261012_022841_initial_sqlite',
  },
]
