<?php

namespace Developer\Ceipa\util;

final class Validate
{
    public static function isEmpty(mixed $data): bool
    {
        return empty($data);
    }

    public static function isUuid(string $data): bool
    {
        return preg_match('/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i', $data);
    }

    public static function isOnlyText(string $data): bool
    {
        return preg_match('/^[a-zA-Z ñÑá-úÁ-Ú]+$/i', $data);
    }

    public static function isOnlyNumber(string $data): bool
    {
        return preg_match('/^[0-9]+$/i', $data);
    }

    public static function isText(string $data): bool
    {
        return preg_match('/^[0-9a-zA-Z ñÑá-úÁ-Ú\.,:;_)(#%¿?@|«»¡!%\-+$]+$/i', $data);
    }

    public static function nameFiles(string $data): bool
    {
        return preg_match('/^[0-9a-zA-Z-\_.)(]+$/i', $data);
    }

    public static function isEmail(string $data): bool
    {
        return preg_match('/^([a-z0-9\._-])*([@])([a-z0-9]*[.])([a-z])+$/i', $data)
            || preg_match('/^([a-z0-9\._-])*([@])([a-z0-9]*[.])([a-z]*[.])([a-z])+$/i', $data);
    }
}
