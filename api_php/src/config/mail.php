<?php
    namespace Developer\Ceipa\config;
    
    /**
     * Mail configuration.
     * Reads from environment variables (Docker) with fallback to defaults (legacy).
     */
    enum Mail:string{
        case HOST = '';
        case USER = '';
        case PASSWORD = '';

        public function resolve(): string {
            return match($this) {
                self::HOST     => getenv('MAIL_HOST') ?: 'smtp.office365.com',
                self::USER     => getenv('MAIL_USER') ?: 'asistente_virtual@ceipa.edu.co',
                // Sin secreto por defecto: MAIL_PASSWORD es obligatorio (viene de los .env).
                self::PASSWORD => ($p = getenv('MAIL_PASSWORD')) !== false
                    ? $p
                    : throw new \RuntimeException('La variable de entorno MAIL_PASSWORD es obligatoria'),
            };
        }
    }