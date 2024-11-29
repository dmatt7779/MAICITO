<?php
    require_once('../vendor/autoload.php');
    require_once('../src/util/jwt.php');

    $validate = new \Developer\Ceipa\class\v1\recover\ValidateMethod;
    $jwtToken = new \Developer\Ceipa\util\JwToken;
    $authorizationHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $requestMethod = $_SERVER['REQUEST_METHOD'];

    try {
        switch ($requestMethod) {
            case 'GET':
                $validate->get($_GET);
                break;
            case 'POST':
                $refer = $_SERVER["HTTP_REFERER"];
                $token = explode("token=", $refer)[1];
                $data = $jwtToken::jwtDecode($token);
                
                $validate->post($data->email, $_POST['password'], $token);
                break;
            default:
                null;
                break;
        }
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode('Acceso denegado: ' . $e->getMessage());
    }