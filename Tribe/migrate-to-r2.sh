#!/bin/bash
# Migration script to sync existing files from Railway volume to Cloudflare R2
# This runs once on container startup if MIGRATE_TO_R2=true is set

set -e

# Check if migration is enabled
if [ "$MIGRATE_TO_R2" != "true" ]; then
    echo "R2 migration disabled. Set MIGRATE_TO_R2=true to enable."
    exit 0
fi

# Check if required env vars are set
if [ -z "$FOF_UPLOAD_AWS_S3_KEY" ] || [ -z "$FOF_UPLOAD_AWS_S3_SECRET" ] || [ -z "$FOF_UPLOAD_AWS_S3_BUCKET" ]; then
    echo "ERROR: R2 credentials not set. Skipping migration."
    exit 1
fi

# Check if already migrated (marker file)
MARKER_FILE="/data/.r2_migration_complete"
if [ -f "$MARKER_FILE" ]; then
    echo "R2 migration already completed. Skipping."
    exit 0
fi

echo "=== Starting R2 Migration ==="

# Configure rclone for Cloudflare R2
mkdir -p ~/.config/rclone
cat > ~/.config/rclone/rclone.conf << EOF
[r2]
type = s3
provider = Cloudflare
access_key_id = ${FOF_UPLOAD_AWS_S3_KEY}
secret_access_key = ${FOF_UPLOAD_AWS_S3_SECRET}
endpoint = ${FOF_UPLOAD_AWS_S3_ENDPOINT}
acl = private
EOF

# Sync files from volume to R2
FILES_DIR="${FILES_VOLUME:-/data/assets/files}"
AVATARS_DIR="${AVATARS_VOLUME:-/data/assets/avatars}"

if [ -d "$FILES_DIR" ] && [ "$(ls -A $FILES_DIR 2>/dev/null)" ]; then
    echo "Syncing files from $FILES_DIR to R2..."
    rclone sync "$FILES_DIR" "r2:${FOF_UPLOAD_AWS_S3_BUCKET}/files/" --progress
    echo "Files sync complete!"
else
    echo "No files found in $FILES_DIR"
fi

if [ -d "$AVATARS_DIR" ] && [ "$(ls -A $AVATARS_DIR 2>/dev/null)" ]; then
    echo "Syncing avatars from $AVATARS_DIR to R2..."
    rclone sync "$AVATARS_DIR" "r2:${FOF_UPLOAD_AWS_S3_BUCKET}/avatars/" --progress
    echo "Avatars sync complete!"
else
    echo "No avatars found in $AVATARS_DIR"
fi

# Create marker file to prevent re-running
touch "$MARKER_FILE"
echo "=== R2 Migration Complete ==="
