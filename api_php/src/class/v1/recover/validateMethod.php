<?php

namespace Developer\Ceipa\class\v1\recover;

use ArgumentCountError;
use Developer\Ceipa\config\Constants;
use Developer\Ceipa\config\Message;
use Developer\Ceipa\config\TypeMessage;
use Error;
use Exception;

class ValidateMethod extends ValidateData
{
    public function get(array $get)
    {
        try {
            if (!isset($get['email'])) throw new ArgumentCountError(
                str_replace('__', Constants::EMAIL->value, Message::NOT_DEFINE_PARAMETER->value),
                intval(TypeMessage::CODE_WARNING->value)
            );

            $this->validateEmail($get['email']);
        } catch (Exception $ex) {
            $warning = [
                'Level' => TypeMessage::WARNING->value,
                'Code' => TypeMessage::HOME_CODE->value . $ex->getCode() . TypeMessage::END_CODE->value,
                'Message' => $ex->getMessage()
            ];
            echo json_encode($warning);
        } catch (Error $err) {
            $error = [
                'Level' => TypeMessage::ERROR->value,
                'Code' => TypeMessage::HOME_CODE->value . $err->getCode() . TypeMessage::END_CODE->value,
                'Message' => $err->getMessage()
            ];
            echo json_encode($error);
        }
    }

    public function post(string $email, string $password, string $token){
        try{
            $_email = trim($email);
            $_password = trim($password);

            if(!isset($_email)) throw new ArgumentCountError(
                str_replace('__', Constants::EMAIL->value, Message::NOT_DEFINE_PARAMETER->value), 
                intval(TypeMessage::CODE_ERROR->value)
            );
            if(!isset($_password)) throw new ArgumentCountError(
                str_replace('__', Constants::PASSWORD->value, Message::NOT_DEFINE_PARAMETER->value), 
                intval(TypeMessage::CODE_ERROR->value)
            );

            $this->handlePost($_email, $_password, $token);
        } catch(Exception $ex){
            $warning = [
                'Level' => TypeMessage::WARNING->value,
                'Code' => TypeMessage::HOME_CODE->value . $ex->getCode() . TypeMessage::END_CODE->value,
                'Message' => $ex->getMessage()
            ];
            echo json_encode($warning);
        } catch(Error $err){
            $error = [
                'Level' => TypeMessage::ERROR->value,
                'Code' => TypeMessage::HOME_CODE->value . $err->getCode() . TypeMessage::END_CODE->value,
                'Message' => $err->getMessage()
            ];
            echo json_encode($error);
        }
    }
}