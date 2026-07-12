<?php

namespace Developer\Ceipa\util;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Developer\Ceipa\config\Jwt as jwtToken;
use Developer\Ceipa\config\TypeMessage;

final class JwToken
{
    public static function jwtEncode(array $payload)
    {
        return JWT::encode($payload, jwtToken::PRIVATE->resolve(), jwtToken::TYPE->resolve());
    }

    public static function jwtDecode(string $jwtEncode)
    {
        try{
            return JWT::decode($jwtEncode, new Key(jwtToken::PUBLIC->resolve(), jwtToken::TYPE->resolve()));
        } catch(\Exception $ex){
            echo json_encode([
                'Level' => TypeMessage::ERROR->value,
                'Code' => TypeMessage::CODE_ERROR->value,
                'Message' => $ex->getMessage()
            ]);
        }
    }
}