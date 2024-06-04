<?php

namespace Developer\Ceipa\class\v1\room;

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
            if (empty($get)) {
                $this->handleSearchRooms();
            } else if (isset($get['id'])) {
                $this->handleSearchRoomById($get['id']);
            }
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

    public function request(array $post = null, array $files = null)
    {
        try {
            if (!isset($post['title'])) throw new ArgumentCountError(
                str_replace('__', Constants::TITLE->value, Message::NOT_DEFINE_PARAMETER->value),
                intval(TypeMessage::CODE_ERROR->value)
            );
            if (!isset($post['introduction'])) throw new ArgumentCountError(
                str_replace('__', Constants::INTRODUCTION->value, Message::NOT_DEFINE_PARAMETER->value),
                intval(TypeMessage::CODE_ERROR->value)
            );
            if (!isset($post['words'])) throw new ArgumentCountError(
                str_replace('__', Constants::WORDS->value, Message::NOT_DEFINE_PARAMETER->value),
                intval(TypeMessage::CODE_ERROR->value)
            );
            if ($post['update'] === false && !isset($files['image'])) throw new ArgumentCountError(
                str_replace('__', Constants::IMAGE->value, Message::NOT_DEFINE_PARAMETER->value),
                intval(TypeMessage::CODE_ERROR->value)
            );
            if ($post['update'] === false && !isset($files['files'])) throw new ArgumentCountError(
                str_replace('__', Constants::FILES->value, Message::NOT_DEFINE_PARAMETER->value),
                intval(TypeMessage::CODE_ERROR->value)
            );

            $this->handleRequest($post, $files);
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
}
