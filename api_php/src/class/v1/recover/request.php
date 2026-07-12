<?php

    namespace Developer\Ceipa\class\v1\recover;

    use Developer\Ceipa\config\Message;
    use Developer\Ceipa\config\TypeMessage;
    use Developer\Ceipa\config\Constants;
    use Developer\Ceipa\util\Statement;
    use InvalidArgumentException;   
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;
    use Developer\Ceipa\config\Mail;
use Developer\Ceipa\util\JwToken;
use PHPMailer\PHPMailer\OAuth;
    use League\OAuth2\Client\Provider\Google;

    class Request extends Statement{
        public function SendEmail(string $email){
            $isValid = $this->ValidateEmail($email);

            if(empty($isValid)){
                echo json_encode([
                    'Level' => TypeMessage::SUCCESS->value,
                    'Code' => TypeMessage::CODE_SUCCESS->value,
                    'Message' => Message::SEND_SUCCESS->value
                ]);
            } else {
                $this->SendRecover($email);

            }            
        }

        private function ValidateEmail(string $email){
            $request = $this->SendRequest('CALL searchEmail(?)', 's', [$email]);
            return $request;
        }

        private function createdMail(string $token){
            // URL pública del sitio (para el enlace del email). Sale de env con
            // fallback al dominio de producción. Los emails requieren URL absoluta.
            $appUrl = rtrim(getenv('APP_PUBLIC_URL') ?: 'https://ubi.ceipa.edu.co', '/');
            $body = "<!DOCTYPE html>";
            $body .= "<html lang='en'>";
            $body .= "<head>";
            $body .= "    <meta charset='UTF-8'>";
            $body .= "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>";
            $body .= "    <title>Asistente virtual - Recuperar cuenta</title>";
            $body .= "</head>";
            $body .= "<body>";
            $body .= "    <center>";
            $body .= "        <a href='$appUrl/recover?token=$token' target=_new> <img src='$appUrl/images/pwd_recover.png' alt='imagen de recuperacion contrasena email'/></a>";
            $body .= "    </center>";
            $body .= "</body>";
            $body .= "</html>";

            return $body;
        }

        private function SendRecover(string $email){
            $mail = new PHPMailer(true);

            $payload = [
                "email" => $email,
                'iat' => time(),
                'exp' => time() + 3600,
            ];
            $token = JwToken::jwtEncode($payload);
            
            $body = $this->createdMail($token);

            try {
                $mail->isSMTP();
                $mail->Host       = Mail::HOST->resolve();
                $mail->Port       = 587; 
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->SMTPAuth   = true; 

                $mail->Username   = Mail::USER->resolve();
                $mail->Password   = Mail::PASSWORD->resolve();
                
                $mail->CharSet = 'UTF-8';
                $mail->setLanguage('es');
                $mail->setFrom(Mail::USER->resolve(), 'Ceipa');
                $mail->addAddress($email, 'Prueba'); 

                $mail->isHTML(true);
                $mail->Subject = 'Asitente Virtual - Recuperación de cuenta';
                $mail->Body = $body;
                
                $mail->send();

                echo json_encode([
                    'Level' => TypeMessage::SUCCESS->value,
                    'Code' => TypeMessage::CODE_SUCCESS->value,
                    'Message' => Message::SEND_SUCCESS->value
                ]);
            } catch (Exception $e) {
                throw new InvalidArgumentException(
                    str_replace('__', Constants::EMAIL->value, $mail->ErrorInfo),
                    intval(TypeMessage::CODE_ERROR->value)
                );
            }
        }

        public function updatePassword(string $email, string $password, string $token){
            $request = $this->SendRequest('CALL updatePassword(?, ?, ?)', 'sss', [$email, $password, $token]);
           
            list($level, , ) = $request[0];
            if($level !== TypeMessage::SUCCESS->value) throw new InvalidArgumentException(
                Message::TOKEN_INVALID->value, 
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