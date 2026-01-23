FROM php:8.1-apache

# Install System Dependencies.
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libcurl4-openssl-dev \
    ca-certificates \
    unzip \
    git \
    curl \
    rclone \
    && rm -rf /var/lib/apt/lists/*

# Configure GD with JPEG and Freetype support
RUN docker-php-ext-configure gd --with-jpeg --with-freetype

# Install PHP Extensions Required By Flarum.
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    gd \
    zip \
    intl \
    mbstring \
    opcache \
    exif \
    curl

# Increase PHP Memory and Upload Limits.
RUN echo "memory_limit = 512M" > /usr/local/etc/php/conf.d/php-limits.ini && \
    echo "upload_max_filesize = 50M" >> /usr/local/etc/php/conf.d/php-limits.ini && \
    echo "post_max_size = 50M" >> /usr/local/etc/php/conf.d/php-limits.ini && \
    echo "max_execution_time = 300" >> /usr/local/etc/php/conf.d/php-limits.ini

# Enable Apache mod_rewrite and proxy modules For Pretty URLs and R2 CDN.
RUN a2enmod rewrite proxy proxy_http ssl headers

# Set Document Root To Public Folder.
ENV APACHE_DOCUMENT_ROOT /var/www/html

# Update Apache Config To Use New Document Root.
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Configure Apache To Allow .htaccess Overrides.
RUN echo '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/flarum.conf && a2enconf flarum

# Copy Flarum Files.
COPY community/public_html /var/www/html

# Install Composer.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install Flarum Dependencies.
WORKDIR /var/www/html
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set Proper Permissions.
RUN mkdir -p /var/www/html/storage /var/www/html/assets
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 775 /var/www/html/storage /var/www/html/assets

# Copy Entrypoint Script.
COPY docker-entrypoint.sh /usr/local/bin/
COPY migrate-to-r2.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh /usr/local/bin/migrate-to-r2.sh

# Disable All MPMs First, Then Enable Only Prefork.
RUN rm -f /etc/apache2/mods-enabled/mpm_*.load \
    && rm -f /etc/apache2/mods-enabled/mpm_*.conf \
    && a2enmod mpm_prefork

# Health Check.
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/ || exit 1

# Railway Uses PORT Environment Variable.
ENV PORT=80
EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
