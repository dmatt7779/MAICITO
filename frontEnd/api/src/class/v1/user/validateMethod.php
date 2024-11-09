<?php
    namespace Developer\Ceipa\class\v1\user;

    use ArgumentCountError;
    use Developer\Ceipa\config\Constants;
    use Developer\Ceipa\config\Message;
    use Developer\Ceipa\config\TypeMessage;
    use Error;
    use Exception;

    class ValidateMethod extends validateData{
        public function get(array $get = null){
            try{
                echo json_encode("GET");
            } catch(Exception $ex){
                echo json_encode($ex->getMessage());
            }
        }

        public function post(array $post = null){
            try{
                if(!isset($post['name'])) throw new ArgumentCountError(
                    str_replace('__', Constants::NAME->value, Message::NOT_DEFINE_PARAMETER->value), 
                    intval(TypeMessage::CODE_ERROR->value)
                );
                if(!isset($post['email'])) throw new ArgumentCountError(
                    str_replace('__', Constants::EMAIL->value, Message::NOT_DEFINE_PARAMETER->value), 
                    intval(TypeMessage::CODE_ERROR->value)
                );
                if(!isset($post['password'])) throw new ArgumentCountError(
                    str_replace('__', Constants::PASSWORD->value, Message::NOT_DEFINE_PARAMETER->value), 
                    intval(TypeMessage::CODE_ERROR->value)
                );

                $this->handlePost($post);
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

        public function patch(array $patch = null){
            try{
                echo json_encode("PATCH
                ");
            } catch(Exception $ex){
                echo json_encode($ex->getMessage());
            }
        }
    }