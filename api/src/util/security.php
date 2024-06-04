<?php
    namespace Developer\Ceipa\util;

    final class Security{
        public static function Encrypt(string $value){
            return password_hash($value, PASSWORD_DEFAULT, ['cost'=>10]);
        }
        
        public static function Verify(string $value, string $hash){
            return password_verify($value, $hash);
        }
    }