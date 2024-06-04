<?php
require_once('../vendor/autoload.php');
require_once('../src/util/jwt.php');

$validate = new \Developer\Ceipa\class\v1\room\ValidateMethod;
$jwt = new \Developer\Ceipa\util\JwToken;
$authorizationHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$requestMethod = $_SERVER['REQUEST_METHOD'];

try {
    $token = substr($authorizationHeader, 7);
    $jwt->jwtDecode($token);

    switch ($requestMethod) {
        case 'GET':
            $validate->get($_GET);
            break;
        case 'POST':
            $validate->request($_POST, $_FILES);
            break;
        default:
            null;
            break;
    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode('Acceso denegado: ' . $e->getMessage());
}
