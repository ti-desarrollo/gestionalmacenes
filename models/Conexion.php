<?php

class Conexion
{
    private $server = '10.2.3.30', $connection;
    private $config = [
        'Database' => 'bd_magazenoj',
        'UID' => 'sa',
        'PWD' => '@123789852456_@M53Q*20*',
        'Characterset' => 'UTF-8',
        'TrustServerCertificate' => true
    ];

    public function __construct()
    {
        date_default_timezone_set('America/Lima');
        $this->connection = sqlsrv_connect($this->server, $this->config) or die(print_r(sqlsrv_errors(), true));
    }

    public function simpleQuery($query, $params): int | bool
    {
        $result = sqlsrv_query($this->connection, $query, $params) or die(print_r(sqlsrv_errors(), true));
        return sqlsrv_rows_affected($result);
    }

    public function returnQuery($query, $params): array
    {
        $result = sqlsrv_query($this->connection, $query, $params) or die(print_r(sqlsrv_errors(), true));
        $response = array();
        $i = 0;
        while ($r = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
            $response[$i] = $r;
            $i++;
        }
        return $response;
    }

    public function lastID(): array
    {
        $last_id = sqlsrv_query($this->connection, 'SELECT SCOPE_IDENTITY() AS idInsertado');
        return sqlsrv_fetch_array($last_id, SQLSRV_FETCH_ASSOC);
    }

    public function closeConnection(): void
    {
        sqlsrv_close($this->connection);
    }
}
