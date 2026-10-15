import * as migration_20261012_022841_initial_sqlite from './20261012_022841_initial_sqlite'
import * as migration_20261013_050320_add_user_headshot from './20261013_050320_add_user_headshot'
import * as migration_20261015_001210_add_blog_featured_image from './20261015_001210_add_blog_featured_image'
import * as migration_20261015_002517_add_blog_summary_and_topic from './20261015_002517_add_blog_summary_and_topic'

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
  {
    up: migration_20261015_001210_add_blog_featured_image.up,
    down: migration_20261015_001210_add_blog_featured_image.down,
    name: '20261015_001210_add_blog_featured_image',
  },
  {
    up: migration_20261015_002517_add_blog_summary_and_topic.up,
    down: migration_20261015_002517_add_blog_summary_and_topic.down,
    name: '20261015_002517_add_blog_summary_and_topic',
  },
]
