<?php

namespace Developer\Ceipa\class\v1\room;

use DateTime;
use Developer\Ceipa\config\Message;
use Developer\Ceipa\config\States;
use Developer\Ceipa\config\TypeMessage;
use Developer\Ceipa\util\Statement;
use IntlDateFormatter;
use InvalidArgumentException;

class Request extends Statement
{
    private $folderMain = '../public/';
    private $folderFiles = 'files/';
    private $folderImages = 'images/';

    protected function searchRooms()
    {
        $request = $this->SendRequest('CALL searchRooms()');
        $this->buildResultSearchRooms($request);
    }

    private function buildResultSearchRooms(array $response): void
    {
        if (!$response) {
            $result = [
                'Level' => TypeMessage::INFO->value,
                'Code' => TypeMessage::HOME_CODE->value . TypeMessage::CODE_INFO->value . TypeMessage::END_CODE->value,
                'Message' => Message::NOT_RECORD->value
            ];
        } else {
            foreach ($response as $data) {
                $pathFiles = $this->folderMain . $this->folderFiles . $data[3] . '/*';
                $dateCreated = new DateTime($data[4]);
                $formatter = new IntlDateFormatter('es_CO', IntlDateFormatter::LONG, IntlDateFormatter::NONE, null, null, 'dd \'de\' MMMM \'del\' yyyy');

                $result[] = [
                    'id' => $data[0],
                    'title' => $data[1],
                    'words' => $data[2],
                    'files' => count(glob($pathFiles, GLOB_BRACE)),
                    'created' => $formatter->format($dateCreated)
                ];
            }
        }

        echo json_encode($result);
    }

    protected function searchRoom(string $id)
    {
        $request = $this->SendRequest('CALL searchRoom(?)', 's', [$id]);

        if (empty($request)) throw new InvalidArgumentException(
            Message::NOT_RECORD->value,
            TypeMessage::CODE_INFO->value
        );

        list($level,, $message) = $request[0];
        if ($level === TypeMessage::WARNING->value || $level === TypeMessage::ERROR->value) throw new InvalidArgumentException(
            $message,
            TypeMessage::CODE_INFO->value
        );

        $this->buildResultSearchRoom($request);
    }

    private function buildResultSearchRoom(array $response): void
    {
        if (!$response) {
            $result = [
                'Level' => TypeMessage::INFO->value,
                'Code' => TypeMessage::HOME_CODE->value . TypeMessage::CODE_INFO->value . TypeMessage::END_CODE->value,
                'Message' => Message::NOT_RECORD->value
            ];
        } else {
            foreach ($response as $data) {
                $result[] = [
                    'id' => $data[0],
                    'title' => $data[1],
                    'introduction' => $data[2],
                    'words' => $data[3],
                    'path' => $data[4],
                    'files' => explode(',', $data[5]),
                    'image' => 'http://localhost/Ceipa/roomIA/api/public/' . $this->folderImages . $data[4] . '/' . $data[6]
                ];
            }
        }
        echo json_encode($result);
    }

    protected function registerRoom(string $title, string $introduction, string $words, array $files, array $image)
    {
        $nameFiles = implode(',', $files["name"]);
        $nameImage = $image['name'];
        $unique = uniqid();
        $this->createdFolderFiles($unique, $files);
        $this->createdFolderImages($unique, $image);

        $request = $this->SendRequest('CALL registerRoom(?, ?, ?, ?, ?, ?, ?)', 'ssissss', [$title, $introduction, $words, $unique, $nameFiles, $nameImage, States::INACTIVE->value]);
        $this->buildResultRegisterRoom($request);
    }

    private function buildResultRegisterRoom(array $response): void
    {
        list($level,,) = $response[0];
        if ($level !== TypeMessage::SUCCESS->value) {
            throw new InvalidArgumentException(
                Message::DATA_EXIST->value,
                TypeMessage::CODE_INFO->value
            );
        }

        $result = [
            'Level' => TypeMessage::SUCCESS->value,
            'Code' => TypeMessage::HOME_CODE->value . TypeMessage::CODE_SUCCESS->value . TypeMessage::END_CODE->value,
            'Message' => Message::DATA_REGISTER_SUCCESS->value
        ];

        echo json_encode($result);
    }

    protected function updateRoom(string $id, string $title, string $introduction, string $words, string $filesUpdate, string $uuid, array $files = null, array $image = null)
    {
        $this->deleteFiles($uuid, $filesUpdate);
        if (!empty($files)) $this->createdFolderFiles($uuid, $files);
        if (!empty($image)) $this->deleteImages($uuid);
        if (!empty($image)) $this->createdFolderImages($uuid, $image);
        $nameFiles = (!empty($files)) ? implode(',', $files['name']) . ',' . implode(',', json_decode($filesUpdate)) : implode(',', json_decode($filesUpdate));
        $nameImage = (!empty($image)) ? $image['name'] : NULL;

        $request = $this->SendRequest('CALL updateRoom(?, ?, ?, ?, ?, ?, ?)', 'sssisss', [$id, $title, $introduction, $words, $nameFiles, $nameImage, States::INACTIVE->value]);
        $this->buildResultUpdateRoom($request);
    }

    private function buildResultUpdateRoom(array $response): void
    {
        list($level,,) = $response[0];
        if ($level !== TypeMessage::SUCCESS->value) {
            throw new InvalidArgumentException(
                Message::DATA_INCORRECT->value,
                TypeMessage::CODE_INFO->value
            );
        }

        $result = [
            'Level' => TypeMessage::SUCCESS->value,
            'Code' => TypeMessage::HOME_CODE->value . TypeMessage::CODE_SUCCESS->value . TypeMessage::END_CODE->value,
            'Message' => Message::DATA_UPDATE_SUCCESS->value
        ];

        echo json_encode($result);
    }

    private function createdFolderFiles(string $uuid, array $files): void
    {
        $folderFiles =  $this->folderMain . $this->folderFiles . $uuid;

        if (!is_dir($folderFiles) && mkdir($folderFiles, recursive: true)) {
            foreach ($files['tmp_name'] as $key => $file) {
                $name = $files['name'][$key];

                move_uploaded_file($file, "$folderFiles/$name");
            }
        } else {
            foreach ($files['tmp_name'] as $key => $file) {
                $name = $files['name'][$key];

                move_uploaded_file($file, "$folderFiles/$name");
            }
        }
    }

    private function createdFolderImages(string $uuid, array $image): void
    {
        $folderImages = $this->folderMain . $this->folderImages . $uuid;

        if (!is_dir($folderImages) && mkdir($folderImages, recursive: true)) {
            $tmpName = $image['tmp_name'];
            $name = $image['name'];

            move_uploaded_file($tmpName, "$folderImages/$name");
        } else {
            $tmpName = $image['tmp_name'];
            $name = $image['name'];

            move_uploaded_file($tmpName, "$folderImages/$name");
        }
    }

    private function deleteFiles(string $uuid, string $files): void
    {
        $directory = $this->folderMain . $this->folderFiles . $uuid;
        $allFiles = array_diff(scandir($directory, 1), array('..', '.'));
        $savedFiles = json_decode($files);

        foreach ($allFiles as $file) {
            if (!in_array($file, $savedFiles)) {
                unlink($directory . '/' . $file);
            }
        }
    }

    private function deleteImages(string $uuid): void
    {
        $directory = $this->folderMain . $this->folderImages . $uuid;
        $allFiles = array_diff(scandir($directory, 1), array('..', '.'));

        foreach ($allFiles as $file) {
            unlink($directory . '/' . $file);
        }
    }






    // private function folderFiles(string $uuid, string $folderMain, array $files)
    // {

    // }

    // private function folderImages(string $uuid, string $folderMain, array $image)
    // {
    //     $folderImages = $folderMain . $this->folderImages . $uuid;

    //     if (!is_dir($folderImages) && mkdir($folderImages, recursive: true)) {
    //         $tmpName = $image['tmp_name'];
    //         $name = $image['name'];

    //         move_uploaded_file($tmpName, "$folderImages/$name");
    //     }
    // }

    // private function buildJsonRooms(array $data)
    // {
    //     if ($data) {
    //         foreach ($data as $value) {
    //             $pathFiles = $this->folderMain . $this->folderFiles . $value[3] . '/*';
    //             $dateCreated = new DateTime($value[4]);
    //             $formatter = new IntlDateFormatter('es_CO', IntlDateFormatter::LONG, IntlDateFormatter::NONE, null, null, 'dd \'de\' MMMM \'del\' yyyy');

    //             $result[] = [
    //                 'id' => $value[0],
    //                 'title' => $value[1],
    //                 'words' => $value[2],
    //                 'files' => count(glob($pathFiles, GLOB_BRACE)),
    //                 'created' => $formatter->format($dateCreated)
    //             ];
    //         }
    //     } else {
    //         $result = [
    //             'Level' => TypeMessage::INFO->value,
    //             'Code' => TypeMessage::HOME_CODE->value . TypeMessage::CODE_INFO->value . TypeMessage::END_CODE->value,
    //             'Message' => Message::NOT_RECORD->value
    //         ];
    //     }
    //     echo json_encode($result);
    // }

    // private function buildJsonRoom(array $data)
    // {
    //     if ($data) {
    //         foreach ($data as $value) {
    //             $result[] = [
    //                 'id' => $value[0],
    //                 'title' => $value[1],
    //                 'introduction' => $value[2],
    //                 'words' => $value[3],
    //                 'path' => $value[4],
    //                 'files' => explode(',', $value[5]),
    //                 'image' => $value[6]
    //             ];
    //         }
    //     } else {
    //         $result = [
    //             'Level' => TypeMessage::INFO->value,
    //             'Code' => TypeMessage::HOME_CODE->value . TypeMessage::CODE_INFO->value . TypeMessage::END_CODE->value,
    //             'Message' => Message::NOT_RECORD->value
    //         ];
    //     }
    //     echo json_encode($result);
    // }
}
