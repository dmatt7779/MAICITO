<?php

// =============================================
// Bootstrap de respuesta HTTP
// =============================================
// Mapea el "Level" de negocio (success/warning/error/information) al código
// HTTP correcto, SIN tener que tocar cada `echo json_encode(...)` de la app.
//
// Cómo funciona: activa un buffer de salida; al terminar el request lee el JSON
// producido y, si trae un campo "Level", fija el código HTTP acorde. Si la
// respuesta no tiene "Level" (p. ej. un 401 de "Acceso denegado" ya seteado a
// mano), respeta el código que se haya definido.

if (!defined('UBI_RESPONSE_BOOTSTRAPPED')) {
    define('UBI_RESPONSE_BOOTSTRAPPED', true);

    ob_start();

    register_shutdown_function(function () {
        $out = ob_get_contents();
        if ($out !== false) {
            ob_end_clean();
        } else {
            $out = '';
        }

        $data = json_decode($out, true);

        if (is_array($data) && isset($data['Level'])) {
            $code = match ($data['Level']) {
                'success'     => 200,   // OK
                'information' => 200,   // informativo (sin registros, etc.)
                'warning'     => 422,   // validación / dato incorrecto
                'error'       => 500,   // error del servidor
                default       => 200,
            };
            if (!headers_sent()) {
                http_response_code($code);
            }
        }

        if (!headers_sent()) {
            header('Content-Type: application/json; charset=utf-8');
        }

        echo $out;
    });
}
