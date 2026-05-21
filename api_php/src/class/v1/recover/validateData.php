<?php

namespace Developer\Ceipa\class\v1\recover;

use Developer\Ceipa\config\Constants;
use Developer\Ceipa\config\States;
use Developer\Ceipa\config\Message;
use Developer\Ceipa\config\TypeMessage;
use InvalidArgumentException;
use Developer\Ceipa\util\Validate;

class ValidateData extends Request
{
    public function __construct(
        protected $validate = new \Developer\Ceipa\util\Validate,
        protected $security = new \Developer\Ceipa\util\Security
    ) {
    }

    public function validateEmail( string $email ){
        if ($this->validate::isEmpty($email)) throw new InvalidArgumentException(
            str_replace('__', Constants::EMAIL->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isEmail($email)) throw new InvalidArgumentException(
            str_replace('__', Constants::EMAIL->value, Message::INCORRECT_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );

        $this->SendEmail($email);
    }

    public function handlePost(string $email, string $password, string $token)
    {
        if($this->validate::isEmpty($email)) throw new InvalidArgumentException(
            str_replace('__', Constants::EMAIL->value, Message::NOT_EMPTY_PARAMETER->value), 
            intval(TypeMessage::CODE_WARNING->value)
        );
        if(!$this->validate::isEmail($email)) throw new InvalidArgumentException(
            str_replace('__', Constants::EMAIL->value, Message::INCORRECT_PARAMETER->value), 
            intval(TypeMessage::CODE_WARNING->value)
        );
        if ($this->validate::isEmpty($password)) throw new InvalidArgumentException(
            str_replace('__', Constants::PASSWORD->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (strlen($password) < Constants::MIN_LENGTH->value) throw new InvalidArgumentException(
            str_replace(array('__', '#'), array(Constants::PASSWORD->value, Constants::MIN_LENGTH->value), Message::LENGTH_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );

        $_password = $this->security::Encrypt($password);
        $this->updatePassword($email, $_password, $token);
    }
}