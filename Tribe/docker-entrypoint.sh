#!/bin/bash
set -e

# Get PORT From Environment.
PORT=${PORT:-80}

# Handle Persistent Storage Volumes.
VOLUME_BASE=""
for base in "/data" "/mnt" "/persistent"; do
    if [ -d "$base" ] && [ -w "$base" ]; then
        VOLUME_BASE="$base"
        break
    fi
done

# If We Have A Volume Base, Create Subdirectories For All Persistent Data.
if [ -n "$VOLUME_BASE" ]; then
    # Create Directory Structure In The Volume.
    mkdir -p $VOLUME_BASE/assets/avatars
    mkdir -p $VOLUME_BASE/assets/files
    mkdir -p $VOLUME_BASE/storage/{cache,formatter,gdpr-exports,less,locale,logs,private-shared/files,sessions,tmp,views}
    
    # Set Variables To Use The Volume Subdirectories.
    AVATARS_VOLUME="$VOLUME_BASE/assets/avatars"
    FILES_VOLUME="$VOLUME_BASE/assets/files"
    STORAGE_VOLUME="$VOLUME_BASE/storage"
else
    # If No Volume Base Found, Check For Individual Volume Mounts.
    AVATARS_VOLUME=""
    FILES_VOLUME=""
    STORAGE_VOLUME=""
    
    # Check For Individual Volume Mounts.
    for path in "/data/assets/avatars" "/mnt/assets/avatars" "/persistent/assets/avatars" "/avatars"; do
        if [ -d "$path" ] && [ -w "$path" ]; then
            AVATARS_VOLUME="$path"
            break
        fi
    done
    
    for path in "/data/assets/files" "/mnt/assets/files" "/persistent/assets/files" "/files"; do
        if [ -d "$path" ] && [ -w "$path" ]; then
            FILES_VOLUME="$path"
            break
        fi
    done
    
    for path in "/data/storage" "/mnt/storage" "/persistent/storage" "/storage"; do
        if [ -d "$path" ] && [ -w "$path" ]; then
            STORAGE_VOLUME="$path"
            break
        fi
    done
fi

# Initialize Avatars Volume.
if [ -n "$AVATARS_VOLUME" ]; then
    # Create Directory If It Doesn't Exist.
    mkdir -p $AVATARS_VOLUME
    # Copy Initial Avatars If Volume Is Empty.
    if [ -z "$(ls -A $AVATARS_VOLUME 2>/dev/null)" ] && [ -d "/var/www/html/assets/avatars" ]; then
        cp -r /var/www/html/assets/avatars/* $AVATARS_VOLUME/ 2>/dev/null || true
    fi
    # Remove Original And Create Symlink.
    rm -rf /var/www/html/assets/avatars
    ln -sf $AVATARS_VOLUME /var/www/html/assets/avatars
    chown -R www-data:www-data $AVATARS_VOLUME 2>/dev/null || true
    chmod -R 775 $AVATARS_VOLUME 2>/dev/null || true
else
    # If No Volume, Ensure Directory Exists And Is Writable.
    mkdir -p /var/www/html/assets/avatars
    chown -R www-data:www-data /var/www/html/assets/avatars 2>/dev/null || true
    chmod -R 775 /var/www/html/assets/avatars 2>/dev/null || true
fi

# Initialize Files Volume.
if [ -n "$FILES_VOLUME" ]; then
    # Create Directory If It Doesn't Exist.
    mkdir -p $FILES_VOLUME
    # Copy Initial Files If Volume Is Empty.
    if [ -z "$(ls -A $FILES_VOLUME 2>/dev/null)" ] && [ -d "/var/www/html/assets/files" ]; then
        cp -r /var/www/html/assets/files/* $FILES_VOLUME/ 2>/dev/null || true
    fi
    # Remove Original And Create Symlink.
    rm -rf /var/www/html/assets/files
    ln -sf $FILES_VOLUME /var/www/html/assets/files
    chown -R www-data:www-data $FILES_VOLUME 2>/dev/null || true
    chmod -R 775 $FILES_VOLUME 2>/dev/null || true
else
    # If No Volume, Ensure Directory Exists And Is Writable.
    mkdir -p /var/www/html/assets/files
    chown -R www-data:www-data /var/www/html/assets/files 2>/dev/null || true
    chmod -R 775 /var/www/html/assets/files 2>/dev/null || true
fi

# Initialize Storage Volume.
if [ -n "$STORAGE_VOLUME" ]; then
    # Create Directory If It Doesn't Exist.
    mkdir -p $STORAGE_VOLUME
    # Create All Required Storage Subdirectories.
    mkdir -p $STORAGE_VOLUME/{cache,formatter,gdpr-exports,less,locale,logs,private-shared/files,sessions,tmp,views}
    # Copy Initial Storage Structure If Volume Is Empty.
    if [ -z "$(ls -A $STORAGE_VOLUME 2>/dev/null)" ] && [ -d "/var/www/html/storage" ]; then
        # Copy Existing Files, Preserving Structure.
        if [ -d "/var/www/html/storage/cache" ]; then
            cp -r /var/www/html/storage/cache/* $STORAGE_VOLUME/cache/ 2>/dev/null || true
        fi
        if [ -d "/var/www/html/storage/formatter" ]; then
            cp -r /var/www/html/storage/formatter/* $STORAGE_VOLUME/formatter/ 2>/dev/null || true
        fi
        if [ -d "/var/www/html/storage/gdpr-exports" ]; then
            cp -r /var/www/html/storage/gdpr-exports/* $STORAGE_VOLUME/gdpr-exports/ 2>/dev/null || true
        fi
        if [ -d "/var/www/html/storage/less" ]; then
            cp -r /var/www/html/storage/less/* $STORAGE_VOLUME/less/ 2>/dev/null || true
        fi
        if [ -d "/var/www/html/storage/locale" ]; then
            cp -r /var/www/html/storage/locale/* $STORAGE_VOLUME/locale/ 2>/dev/null || true
        fi
        if [ -d "/var/www/html/storage/logs" ]; then
            cp -r /var/www/html/storage/logs/* $STORAGE_VOLUME/logs/ 2>/dev/null || true
        fi
        if [ -d "/var/www/html/storage/private-shared" ]; then
            cp -r /var/www/html/storage/private-shared/* $STORAGE_VOLUME/private-shared/ 2>/dev/null || true
        fi
        if [ -d "/var/www/html/storage/sessions" ]; then
            cp -r /var/www/html/storage/sessions/* $STORAGE_VOLUME/sessions/ 2>/dev/null || true
        fi
        if [ -d "/var/www/html/storage/tmp" ]; then
            cp -r /var/www/html/storage/tmp/* $STORAGE_VOLUME/tmp/ 2>/dev/null || true
        fi
        if [ -d "/var/www/html/storage/views" ]; then
            cp -r /var/www/html/storage/views/* $STORAGE_VOLUME/views/ 2>/dev/null || true
        fi
    fi
    # Remove Original And Create Symlink.
    rm -rf /var/www/html/storage
    ln -sf $STORAGE_VOLUME /var/www/html/storage
    chown -R www-data:www-data $STORAGE_VOLUME 2>/dev/null || true
    chmod -R 775 $STORAGE_VOLUME 2>/dev/null || true
else
    # If No Volume, Ensure All Storage Directories Exist And Are Writable.
    mkdir -p /var/www/html/storage/{cache,formatter,gdpr-exports,less,locale,logs,private-shared/files,sessions,tmp,views}
    chown -R www-data:www-data /var/www/html/storage 2>/dev/null || true
    chmod -R 775 /var/www/html/storage 2>/dev/null || true
fi

# Ensure Static Asset Directories Exist And Are Writable.
# These Come From GitHub But Need To Be Writable In Case Flarum Needs To Update Them.
mkdir -p /var/www/html/assets/{fonts,extensions}
chown -R www-data:www-data /var/www/html/assets/{fonts,extensions} 2>/dev/null || true
chmod -R 775 /var/www/html/assets/{fonts,extensions} 2>/dev/null || true

# Configure Apache To Listen On The PORT.
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/*.conf 2>/dev/null || true

# Configure R2 CDN Redirects For Avatars And Files (if CDN URL is set)
if [ -n "$FOF_UPLOAD_CDN_URL" ]; then
    echo "Configuring R2 CDN redirects to: $FOF_UPLOAD_CDN_URL"
    
    # We use a temporary file to construct the new rules
    cat > /var/www/html/.htaccess.r2 << EOF
# R2 CDN Redirects
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^assets/avatars/(.*)$ ${FOF_UPLOAD_CDN_URL}/assets/avatars/\$1 [R=302,L]
    RewriteRule ^assets/files/(.*)$ ${FOF_UPLOAD_CDN_URL}/assets/files/\$1 [R=302,L]
</IfModule>
EOF
    
    # Prepend the rules to the main .htaccess file
    if [ -f /var/www/html/.htaccess ]; then
        # Check if we already added them to avoid duplicates
        if ! grep -q "R2 CDN Redirects" /var/www/html/.htaccess; then
            cat /var/www/html/.htaccess.r2 /var/www/html/.htaccess > /var/www/html/.htaccess.temp
            mv /var/www/html/.htaccess.temp /var/www/html/.htaccess
            echo "R2 redirects prepended to .htaccess"
        fi
    else
        mv /var/www/html/.htaccess.r2 /var/www/html/.htaccess
    fi
    rm -f /var/www/html/.htaccess.r2
fi

# Ensure Permissions Are Correct.
chown -R www-data:www-data /var/www/html 2>/dev/null || true
chmod -R 775 /var/www/html/storage /var/www/html/assets 2>/dev/null || true

# Run Flarum Maintenance Commands To Regenerate Assets And Clear Cache.
cd /var/www/html
if [ -f "flarum" ]; then
    echo "Running Flarum Maintenance Commands..."
    
    # Wait A Moment For Database To Be Ready.
    sleep 2
    
    # Clear Cache First.
    echo "Clearing Cache..."
    php flarum cache:clear 2>/dev/null || echo "Cache Clear Completed."
    
    # Publish/Recompile Assets.
    echo "Publishing Assets..."
    # Increase PHP Memory Limit For Asset Compilation.
    php -d memory_limit=512M flarum assets:publish 2>/dev/null || echo "Assets Publish Completed."
    
    # Run Migrations If Needed.
    echo "Running Migrations..."
    php flarum migrate 2>/dev/null || echo "Migrations Completed."
    
    echo "Flarum Maintenance Commands Completed."
fi

# --- SAFETY FIX: Ensure only one MPM is loaded ---
# We delete all MPM configs and explicitly enable prefork right before start.
rm -f /etc/apache2/mods-enabled/mpm_*.load
rm -f /etc/apache2/mods-enabled/mpm_*.conf
a2enmod mpm_prefork

# Run R2 Migration Script (if enabled via MIGRATE_TO_R2=true)
if [ -f "/usr/local/bin/migrate-to-r2.sh" ]; then
    /usr/local/bin/migrate-to-r2.sh || echo "R2 migration skipped or failed."
fi

# Start Apache.
exec apache2-foreground
