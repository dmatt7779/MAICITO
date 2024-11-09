<?php
require_once('../vendor/autoload.php');
require_once('../src/util/jwt.php');

$validate = new \Developer\Ceipa\class\v1\login\signIn\ValidateMethod;
$validate->post($_POST);
