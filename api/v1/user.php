<?php
    require_once('../vendor/autoload.php');
    
    $validate = new \Developer\Ceipa\class\v1\user\ValidateMethod;

    $method = $_SERVER['REQUEST_METHOD'];
    switch($method){
        case 'GET':
            $validate->get($_GET);
            break;
        case 'POST':
            $_POST = json_decode(file_get_contents('php://input'), true);
            $validate->post($_POST);            
            break;
        case 'PATCH':
            $_PATCH = json_decode(file_get_contents('php://input'), true);
            $validate->patch($_PATCH);
            break;
        default:
            null;
            break;
    }