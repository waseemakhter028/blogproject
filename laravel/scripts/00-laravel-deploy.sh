#!/usr/bin/env bash
echo "Running composer"
composer global require hirak/prestissimo
composer install --no-dev --working-dir=/var/www/html

echo "Clear view..."
php artisan view:clear

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

