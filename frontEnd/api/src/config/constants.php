<?php

namespace Developer\Ceipa\config;

enum Constants: string
{
    case ID = 'id';
    case NAME = 'name';
    case EMAIL = 'email';
    case PASSWORD = 'password';
    case MIN_LENGTH = '10';
    case TOKEN = 'token';
    case TITLE = 'title';
    case MODEL = 'model';
    case INTRODUCTION = 'introduction';
    case WORDS = 'words';
    case IMAGE = 'image';
    case FILES = 'files';
    case PARAM = 'parameter';
    case STATE = 'state';
    case DELETE_ROOM = 'deleteRoom';
    case UPDATE_STATE_ROOM = 'updateStateRoom';
}
