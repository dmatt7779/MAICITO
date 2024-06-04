<?php
    namespace Developer\Ceipa\class\v1\user;

    use Developer\Ceipa\config\Constants;
    use Developer\Ceipa\config\Message;
    use Developer\Ceipa\config\TypeMessage;
    use InvalidArgumentException;

    class validateData extends Request{
        public function __construct(
            protected $validate = new \Developer\Ceipa\util\Validate,
            protected $security = new \Developer\Ceipa\util\Security
        ){}

        public function handlePost(array $post){
            $name = trim($post['name']);
            $email = trim($post['email']);
            $password = trim($post['password']);

            if($this->validate::isEmpty($name)) throw new InvalidArgumentException(
                str_replace('__', Constants::NAME->value, Message::NOT_EMPTY_PARAMETER->value), 
                intval(TypeMessage::CODE_WARNING->value)
            );
            if(!$this->validate::isOnlyText($name)) throw new InvalidArgumentException(
                str_replace('__', Constants::NAME->value, Message::INCORRECT_PARAMETER->value), 
                intval(TypeMessage::CODE_WARNING->value)
            );
            if($this->validate::isEmpty($email)) throw new InvalidArgumentException(
                str_replace('__', Constants::EMAIL->value, Message::NOT_EMPTY_PARAMETER->value), 
                intval(TypeMessage::CODE_WARNING->value)
            );
            if(!$this->validate::isEmail($email)) throw new InvalidArgumentException(
                str_replace('__', Constants::EMAIL->value, Message::INCORRECT_PARAMETER->value), 
                intval(TypeMessage::CODE_WARNING->value)
            );
            if($this->validate::isEmpty($password)) throw new InvalidArgumentException(
                str_replace('__', Constants::PASSWORD->value, Message::NOT_EMPTY_PARAMETER->value), 
                intval(TypeMessage::CODE_WARNING->value)
            );
            if(strlen($password) < Constants::MIN_LENGTH->value) throw new InvalidArgumentException(
                str_replace(array('__', '#'), array(Constants::PASSWORD->value, Constants::MIN_LENGTH->value), Message::LENGTH_PARAMETER->value), 
                intval(TypeMessage::CODE_WARNING->value)
            );

            $_name = mb_strtoupper($name);
            $_email = mb_strtolower($email);
            $_password = $this->security::Encrypt($password);
            
            $this->registerUser($_name, $_email, $_password);
        }
    }
