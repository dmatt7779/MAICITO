<?php
    namespace Developer\Ceipa\class\v1\user;

    use Developer\Ceipa\config\Message;
    use Developer\Ceipa\config\States;
    use Developer\Ceipa\config\TypeMessage;
    use Developer\Ceipa\util\Statement;
    use InvalidArgumentException;

    class Request extends Statement{
        protected function registerUser(string $name, string $email, string $password, ){
            $request = $this->SendRequest('CALL registerUser(?, ?, ?, ?)', 'ssss', [$name, $email, $password, States::INACTIVE->value]);

            list($level, , ) = $request[0];
            if($level !== TypeMessage::SUCCESS->value) throw new InvalidArgumentException(
                Message::DATA_EXIST->value, 
                TypeMessage::CODE_INFO->value
            );
            
            $success = [
                'Level' => TypeMessage::SUCCESS->value,
                'Code' => TypeMessage::CODE_SUCCESS->value,
                'Message' => Message::DATA_SUCCESS->value
            ];
            echo json_encode($success);
        }
    }