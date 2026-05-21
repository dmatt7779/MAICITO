<?php

namespace Developer\Ceipa\connection;

use Developer\Ceipa\config\Connection as Conn;
use Developer\Ceipa\config\Message;
use Exception;

class Connection
{
    protected $connection;

    protected function connect(): bool
    {
        $this->connection = mysqli_init();

        if (!$this->connection) throw new Exception(Message::NOT_INIT_DB->value);

        if (!mysqli_real_connect(
            $this->connection,
            Conn::HOST->value,
            Conn::USER->value,
            Conn::PASSWORD->value,
            Conn::DATABASE->value,
            Conn::PORT->value
        )) throw new Exception(
            str_replace(
                array('__', '--'),
                array(mysqli_connect_errno(), mysqli_connect_error()),
                Message::NOT_CONNECT->value
            )
        );

        return true;
    }

    protected function Disconnect()
    {
        if ($this->connection) $this->connection->close();
    }
}
