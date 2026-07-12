<?php
    namespace Developer\Ceipa\config;
    
    /**
     * Database connection configuration.
     * Reads from environment variables (Docker) with fallback to defaults (legacy).
     */
    enum Connection:string{
        case HOST = '';
        case USER = '';
        case PASSWORD = '';
        case DATABASE = '';
        case PORT = '';

        public function resolve(): string {
            return match($this) {
                self::HOST     => getenv('DB_HOST') ?: 'localhost',
                self::USER     => getenv('DB_USER') ?: 'root',
                // Sin secreto por defecto: DB_PASSWORD es obligatorio (viene de los .env).
                self::PASSWORD => ($p = getenv('DB_PASSWORD')) !== false
                    ? $p
                    : throw new \RuntimeException('La variable de entorno DB_PASSWORD es obligatoria'),
                self::DATABASE => getenv('DB_NAME') ?: 'ceipa_chatbot',
                self::PORT     => getenv('DB_PORT') ?: '3306',
            };
        }
    }