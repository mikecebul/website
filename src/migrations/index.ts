import * as migration_20261012_022841_initial_sqlite from './20261012_022841_initial_sqlite'
import * as migration_20261013_050320_add_user_headshot from './20261013_050320_add_user_headshot'

export const migrations = [
  {
    up: migration_20261012_022841_initial_sqlite.up,
    down: migration_20261012_022841_initial_sqlite.down,
    name: '20261012_022841_initial_sqlite',
  },
  {
    up: migration_20261013_050320_add_user_headshot.up,
    down: migration_20261013_050320_add_user_headshot.down,
    name: '20261013_050320_add_user_headshot',
  },
]
