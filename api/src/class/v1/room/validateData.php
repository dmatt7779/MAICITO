<?php

namespace Developer\Ceipa\class\v1\room;

use Developer\Ceipa\config\Constants;
use Developer\Ceipa\config\Message;
use Developer\Ceipa\config\TypeMessage;
use InvalidArgumentException;
use Developer\Ceipa\util\Validate;

class ValidateData extends Request
{
    public function __construct(
        protected $validate = new Validate()
    ) {
    }

    protected function handleSearchRooms()
    {
        $this->searchRooms();
    }

    protected function handleSearchRoomById(string $id)
    {
        if ($this->validate::isEmpty($id)) throw new InvalidArgumentException(
            str_replace('__', Constants::PARAM->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isUuid($id)) throw new InvalidArgumentException(
            str_replace('__', Constants::PARAM->value, Message::INCORRECT_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );

        $this->searchRoom($id);
    }

    public function handleRequest(array $post, array $files)
    {
        $update = json_decode($post['update']);

        if (!$update) {
            $this->handlePost($post, $files);
        } else {
            $this->handlePatch($post, $files);
        }
    }

    private function handlePost(array $post, array $files)
    {
        $title = trim($post['title']);
        $introduction = trim($post['introduction']);
        $words = trim($post['words']);
        $image = $files['image'];
        $files = $files['files'];

        if ($this->validate::isEmpty($title)) throw new InvalidArgumentException(
            str_replace('__', Constants::TITLE->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isOnlyText($title)) throw new InvalidArgumentException(
            str_replace('__', Constants::TITLE->value, Message::INCORRECT_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if ($this->validate::isEmpty($introduction)) throw new InvalidArgumentException(
            str_replace('__', Constants::INTRODUCTION->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isText($introduction)) throw new InvalidArgumentException(
            str_replace('__', Constants::INTRODUCTION->value, Message::INCORRECT_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isOnlyNumber($words)) throw new InvalidArgumentException(
            str_replace('__', Constants::WORDS->value, Message::INCORRECT_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );

        if ($this->validate::isEmpty($image)) throw new InvalidArgumentException(
            str_replace('__', Constants::IMAGE->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::nameFiles($image['name'])) throw new InvalidArgumentException(
            str_replace('__', Constants::WORDS->value, Message::INCORRECT_NAME->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        $infoImage = getimagesize($image['tmp_name']);
        if ($infoImage[0] > '128' && $infoImage[1] > '128') throw new InvalidArgumentException(
            str_replace('__', Constants::IMAGE->value, Message::DIMENSION_INCORRECT->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if ($this->validate::isEmpty($files)) throw new InvalidArgumentException(
            str_replace('__', Constants::FILES->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        foreach ($files['name'] as $file) {
            if (!$this->validate::nameFiles($file)) throw new InvalidArgumentException(
                str_replace('__', $file, Message::INCORRECT_NAME->value),
                intval(TypeMessage::CODE_WARNING->value)
            );
        }

        $_title = mb_strtoupper($title);
        $_introduction = mb_strtoupper($introduction);

        $this->registerRoom($_title, $_introduction, $words, $files, $image);
    }

    private function handlePatch(array $post, array $files)
    {
        $id = trim($post['id']);
        $title = trim($post['title']);
        $introduction = trim($post['introduction']);
        $words = trim($post['words']);
        $image = isset($files['image']) ? $files['image'] : null;
        $files = isset($files['files']) ? $files['files'] : null;
        $filesUpdate = trim($post['filesUpdate']);
        $path = trim($post['path']);

        if ($this->validate::isEmpty($id)) throw new InvalidArgumentException(
            str_replace('__', Constants::ID->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isUuid($id)) throw new InvalidArgumentException(
            str_replace('__', Constants::ID->value, Message::INCORRECT_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if ($this->validate::isEmpty($title)) throw new InvalidArgumentException(
            str_replace('__', Constants::TITLE->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isOnlyText($title)) throw new InvalidArgumentException(
            str_replace('__', Constants::TITLE->value, Message::INCORRECT_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if ($this->validate::isEmpty($introduction)) throw new InvalidArgumentException(
            str_replace('__', Constants::INTRODUCTION->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isText($introduction)) throw new InvalidArgumentException(
            str_replace('__', Constants::INTRODUCTION->value, Message::INCORRECT_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isOnlyNumber($words)) throw new InvalidArgumentException(
            str_replace('__', Constants::WORDS->value, Message::INCORRECT_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );
        if (!$this->validate::isEmpty($image) && $this->validate::nameFiles($image['name'])) {
            $infoImage = getimagesize($image['tmp_name']);
            if ($infoImage[0] > '128' && $infoImage[1] > '128') throw new InvalidArgumentException(
                str_replace('__', Constants::IMAGE->value, Message::DIMENSION_INCORRECT->value),
                intval(TypeMessage::CODE_WARNING->value)
            );
        }
        if (!$this->validate::isEmpty($files)) {
            foreach ($files['name'] as $file) {
                if (!$this->validate::nameFiles($file)) throw new InvalidArgumentException(
                    str_replace('__', $file, Message::INCORRECT_NAME->value),
                    intval(TypeMessage::CODE_WARNING->value)
                );
            }
        }
        if ($this->validate::isEmpty($filesUpdate)) throw new InvalidArgumentException(
            str_replace('__', Constants::FILES->value, Message::NOT_EMPTY_PARAMETER->value),
            intval(TypeMessage::CODE_WARNING->value)
        );

        $_title = mb_strtoupper($title);
        $_introduction = mb_strtoupper($introduction);

        $this->updateRoom($id, $_title, $_introduction, $words, $filesUpdate, $path, $files, $image);
    }
}
