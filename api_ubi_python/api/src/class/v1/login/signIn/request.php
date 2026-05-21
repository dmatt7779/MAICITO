<?php
    namespace Developer\Ceipa\class\v1\login\signIn;

    use Developer\Ceipa\config\Message;
    use Developer\Ceipa\config\TypeMessage;
    use Developer\Ceipa\util\Statement;
    use InvalidArgumentException;

    class Request extends Statement{
        public function signIn(string $email){
            $request = $this->SendRequest('CALL signIn(?)', 's', [$email]);
            return $request;
        }

        public function updateSignIn(string $id, string $token , string $state){
            $request = $this->SendRequest('CALL updateSignIn(?, ?, ?)', 'sss', [$id, $token, $state]);

            list($level, , ) = $request[0];
            if($level !== TypeMessage::SUCCESS->value) throw new InvalidArgumentException(
                Message::DATA_INCORRECT->value, 
                TypeMessage::CODE_INFO->value
            );
        }
    }