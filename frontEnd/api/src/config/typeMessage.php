<?php

namespace Developer\Ceipa\config;

enum TypeMessage: string
{
    case HOME_CODE = 'CEIPA';
    case END_CODE = 'IA';
    case CODE_ERROR = '428';
    case ERROR = 'error';
    case CODE_WARNING = '406';
    case WARNING = 'warning';
    case CODE_SUCCESS = '200';
    case SUCCESS = 'success';
    case CODE_INFO = '102';
    case INFO = 'information';
};
