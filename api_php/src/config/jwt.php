<?php

namespace Developer\Ceipa\config;

use RuntimeException;

/**
 * Configuración de llaves JWT.
 *
 * Las llaves RSA NO viven en el código. Se leen desde archivos PEM montados
 * FUERA del document root de Apache (por defecto /var/www/keys), cuya ruta se
 * puede sobrescribir con las variables de entorno JWT_PRIVATE_KEY_FILE y
 * JWT_PUBLIC_KEY_FILE. Los archivos están gitignored y excluidos de la imagen.
 */
enum Jwt: string
{
    case PRIVATE = 'private';
    case PUBLIC  = 'public';
    case TYPE    = 'RS256';

    public function resolve(): string
    {
        return match ($this) {
            self::PRIVATE => self::readKeyFile(
                getenv('JWT_PRIVATE_KEY_FILE') ?: '/var/www/keys/jwt_private.pem'
            ),
            self::PUBLIC => self::readKeyFile(
                getenv('JWT_PUBLIC_KEY_FILE') ?: '/var/www/keys/jwt_public.pem'
            ),
            self::TYPE => self::TYPE->value,
        };
    }

    private static function readKeyFile(string $path): string
    {
        $key = is_readable($path) ? file_get_contents($path) : false;

        if ($key === false || trim($key) === '') {
            throw new RuntimeException("JWT key file missing or empty at: {$path}");
        }

        return $key;
    }
}
