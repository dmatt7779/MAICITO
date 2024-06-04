<?php

namespace Developer\Ceipa\class\v1\login\signIn;

use Developer\Ceipa\config\Constants;
use Developer\Ceipa\config\Message;
use Developer\Ceipa\config\States;
use Developer\Ceipa\config\TypeMessage;
use Developer\Ceipa\util\JwToken;
use Developer\Ceipa\util\Security;
use InvalidArgumentException;

class ValidateData extends Request
{
    public function __construct(
        protected $validate = new \Developer\Ceipa\util\Validate,
        protected $security = new \Developer\Ceipa\util\Security
    ) {
    }

    public function handlePost(array $post = null)
    {
        $email = trim($post['email']);
        $password = trim($post['password']);

        if ($this->validate::isEmpty($email)) throw new InvalidArgumentException(
            str_replace('__', Constants::EMAIL->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isEmail($email)) throw new InvalidArgumentException(
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

        $_email = mb_strtolower($email);

        $request = $this->signIn($_email);
        if (empty($request)) throw new InvalidArgumentException(Message::DATA_ERROR->value);

        $this->validateRequest($request, $password);
    }

    private function validateRequest(array $result, string $_password)
    {
        list($id, $name, $email, $password, $state, $token) = $result[0];

        if (!Security::Verify($_password, $password)) throw new InvalidArgumentException(Message::DATA_ERROR->value);

        if ($state === States::INACTIVE->value) {
            $payload = [
                'id' => $id,
                'name' => $name,
                'email' => $email
            ];
            $token = JwToken::jwtEncode($payload);

            $this->updateSignIn($id, $token, States::ACTIVE->value, $name, $email);
        }

        $success = [
            'Level' => TypeMessage::SUCCESS->value,
            'isLogged' => true,
            'name' => $name,
            'email' => $email,
            'token' => $token
        ];
        echo json_encode($success);
    }
}
