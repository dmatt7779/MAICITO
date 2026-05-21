<?php

namespace Developer\Ceipa\config;

enum Message: string
{
    case NOT_INIT_DB = 'No se puede inicializar MySQLi';
    case NOT_CONNECT = 'No se pudo establecer conexión con la base de datos. (__) : (--)';
    case NOT_DEFINE_PARAMETER = 'No se ha definido el parámetro (__).';
    case NOT_EMPTY_PARAMETER = 'El parámetro (__) no puede estar vació.';
    case INCORRECT_PARAMETER = 'El parámetro (__) es incorrecto.';
    case LENGTH_PARAMETER = 'El parámetro (__) debe ser mayor o igual a # caracteres.';
    case DATA_ERROR = 'La información suministrada es incorrecta.';
    case DATA_EXIST = 'La información suministrada ya se encuentra registrado en el sistema';
    case DATA_REGISTER_SUCCESS = 'La información suministrada se ha registrado correctamente.';
    case DATA_INCORRECT = 'Se generó un error en el sistema,  por favor intentarlo nuevamente.';
    case DIMENSION_INCORRECT = 'La (__) tiene el tamaño incorrecto. Recuerda que es (128 x 128)';
    case NOT_RECORD = 'La petición no arroja información';
    case INCORRECT_NAME = 'El nombre del archivo es incorrecto. (__)';
    case DATA_UPDATE_SUCCESS = 'La información suministrada se ha actualizado correctamente.';
    case DELETE_SUCCESS = 'El asistente se ha eliminado correctamente.';
    case SEND_SUCCESS = 'Se ha enviado la recuperación de la cuenta al email indicado.';
    case DATA_SUCCESS = 'La ejecución se ha realizado correctamente.';
    case TOKEN_INVALID = 'El token ya no se encuentra activo por el sistema.';
}
