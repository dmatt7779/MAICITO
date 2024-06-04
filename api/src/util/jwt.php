<?php

namespace Developer\Ceipa\util;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Developer\Ceipa\config\Jwt as jwtToken;

final class JwToken
{
    public static function jwtEncode(array $payload)
    {
        return JWT::encode($payload, jwtToken::PRIVATE->value, jwtToken::TYPE->value);
    }

    public static function jwtDecode(string $jwtEncode)
    {
        return JWT::decode($jwtEncode, new Key(jwtToken::PUBLIC->value, jwtToken::TYPE->value));
    }

    public static function jwtValidate()
    {
    }
}

$data = new JwToken();
$data->jwtEncode(["name" => "yo"]);
