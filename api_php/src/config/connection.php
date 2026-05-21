<?php
    namespace Developer\Ceipa\config;
    
    enum Connection:string{
        case HOST = 'localhost';
        case USER = 'root';
        case PASSWORD = 'Ceipa.2024**';
        case DATABASE = 'ceipa_chatbot';
        case PORT = '3306';
    }