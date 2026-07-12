# =============================================
# UBI PHP Backend - Dockerfile (Apache + PHP 8.2)
# =============================================

FROM php:8.2-apache

# Install system dependencies and PHP extensions needed by the project
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install mysqli zip \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache modules required by .htaccess
RUN a2enmod rewrite headers

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory to Apache's document root
WORKDIR /var/www/html/api

# Copy composer files first (layer caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy the rest of the application
COPY . .

# Re-run composer to execute scripts if any
RUN composer dump-autoload --optimize

# Copy custom Apache VirtualHost configuration
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Create shared directories for uploads (volume mount points) and the
# local public/ upload dirs. These are created explicitly so the build
# does not depend on public/ being present in the context (it is excluded
# via .dockerignore — uploaded content lives in the ubi-uploads volume).
RUN mkdir -p /var/www/shared/files \
    /var/www/shared/images \
    /var/www/shared/pdf_questions \
    /var/www/shared/chat_history \
    /var/www/html/api/public/files \
    /var/www/html/api/public/images \
    /var/www/keys \
    && chown -R www-data:www-data /var/www/shared \
    && chown -R www-data:www-data /var/www/html/api/public

# Set proper permissions for Apache
RUN chown -R www-data:www-data /var/www/html/api

EXPOSE 80
