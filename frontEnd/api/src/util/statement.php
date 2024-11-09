<?php

namespace Developer\Ceipa\util;

use Developer\Ceipa\connection\Connection;

class Statement extends Connection
{
    protected function SendRequest(string $sql, ?string $types = null, ?array $params = null): array
    {
        if ($this->Connect()) {
            $statement = $this->connection->prepare($sql);
            ($types !== null && $params !== null) && $statement->bind_param($types, ...$params);
            $statement->execute();
            $result = $statement->get_result();
            return $result->fetch_all(MYSQLI_NUM);
            $this->Disconnect();
        }
    }
}
