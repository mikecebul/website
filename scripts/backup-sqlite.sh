#!/bin/sh
# Run inside the website container; credentials stay in its environment.
set -eu
umask 077

fail() { echo "SQLite backup: $*" >&2; exit 1; }
: "${BACKUP_DESTINATION:?Set BACKUP_DESTINATION to s3://private-bucket/prefix}"
# Never combine one backup key with one media key.
if [ -n "${BACKUP_S3_ACCESS_KEY_ID:-}${BACKUP_S3_SECRET_ACCESS_KEY:-}" ]; then
  : "${BACKUP_S3_ACCESS_KEY_ID:?Missing BACKUP_S3_ACCESS_KEY_ID}"
  : "${BACKUP_S3_SECRET_ACCESS_KEY:?Missing BACKUP_S3_SECRET_ACCESS_KEY}"
  backup_key="$BACKUP_S3_ACCESS_KEY_ID"
  backup_secret="$BACKUP_S3_SECRET_ACCESS_KEY"
else
  : "${S3_ACCESS_KEY_ID:?Missing S3_ACCESS_KEY_ID}"
  : "${S3_SECRET_ACCESS_KEY:?Missing S3_SECRET_ACCESS_KEY}"
  backup_key="$S3_ACCESS_KEY_ID"
  backup_secret="$S3_SECRET_ACCESS_KEY"
fi
: "${S3_ENDPOINT:?Missing S3_ENDPOINT}"

case "${DATABASE_URI:-file:/app/data/payload.db}" in
  file:*) database_path="${DATABASE_URI:-file:/app/data/payload.db}"; database_path="${database_path#file:}" ;;
  *) fail 'DATABASE_URI must point to a local SQLite file' ;;
esac
[ -s "$database_path" ] || fail 'Database file is missing or empty'
case "$BACKUP_DESTINATION" in
  s3://*) destination="${BACKUP_DESTINATION#s3://}" ;;
  *) fail 'BACKUP_DESTINATION must use s3://bucket/prefix' ;;
esac
case "$destination" in
  */?*) ;;
  *) fail 'Use a dedicated backup prefix, e.g. s3://private-bucket/website/sqlite' ;;
esac
bucket="${destination%%/*}"
[ "$bucket" != "${S3_BUCKET:-}" ] || fail 'Use a private backup bucket separate from the media bucket'
for tool in sqlite3 gzip rclone flock mktemp; do
  command -v "$tool" >/dev/null 2>&1 || fail "Required tool is missing: $tool"
done

# An OS lock releases automatically even if the job is killed or the container exits.
exec 9>"${database_path}.backup.lock"
if ! flock -n 9; then
  echo 'SQLite backup: another backup is running; skipping this execution'
  exit 0
fi
workdir="$(mktemp -d /tmp/website-sqlite-backup.XXXXXX)"
trap 'rm -rf "$workdir"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
filename="website-$(date -u +%Y%m%dT%H%M%SZ)-${workdir##*.}.db"
snapshot="$workdir/$filename"

# SQLite's online backup API includes committed WAL data without stopping Payload.
echo 'SQLite backup: creating snapshot'
sqlite3 -readonly "$database_path" '.timeout 10000' ".backup '$snapshot'"
# The finished snapshot is standalone; normalize its journal mode for portable restores.
sqlite3 "$snapshot" 'PRAGMA journal_mode=DELETE;' >/dev/null
[ "$(sqlite3 -readonly "$snapshot" 'PRAGMA integrity_check;')" = 'ok' ] || fail 'Snapshot integrity check failed'
gzip "$snapshot"

# Adapt the existing Payload S3 settings; never write keys to a config file or CLI args.
export RCLONE_CONFIG_SQLITEBACKUP_TYPE=s3
export RCLONE_CONFIG_SQLITEBACKUP_PROVIDER=Other
export RCLONE_CONFIG_SQLITEBACKUP_ACCESS_KEY_ID="$backup_key"
export RCLONE_CONFIG_SQLITEBACKUP_SECRET_ACCESS_KEY="$backup_secret"
export RCLONE_CONFIG_SQLITEBACKUP_REGION="${S3_REGION:-auto}"
export RCLONE_CONFIG_SQLITEBACKUP_ENDPOINT="$S3_ENDPOINT"
export RCLONE_CONFIG_SQLITEBACKUP_ACL=private
export RCLONE_CONFIG_SQLITEBACKUP_NO_CHECK_BUCKET=true
export RCLONE_CONFIG_SQLITEBACKUP_FORCE_PATH_STYLE=true

remote="sqlitebackup:${destination%/}/$filename.gz"
echo 'SQLite backup: uploading verified snapshot'
rclone copyto "$snapshot.gz" "$remote" --config /dev/null \
  --retries 3 --low-level-retries 10 --transfers 1 --checkers 1 \
  --s3-upload-concurrency 1 --s3-chunk-size 8Mi --log-level NOTICE
# Read the uploaded object back and compare the compressed bytes before reporting success.
rclone cat "$remote" --config /dev/null --retries 3 --log-level NOTICE > "$workdir/uploaded.gz"
cmp "$snapshot.gz" "$workdir/uploaded.gz" || fail 'Uploaded object did not match the snapshot'
echo "SQLite backup: completed and verified $filename.gz"
