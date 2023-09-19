<?php

require_once 'Conexion.php';

class TransferenciaStock extends Conexion
{

    public function __construct()
    {
        parent::__construct();
    }

    public function listarTransferencias(string $sede, string $inicio, string $fin): array
    {
        return $this->returnQuery('EXEC sp_listarTransfStock ?, ?, ?', [$sede, $inicio, $fin]);
    }

    public function listarDetalle(string $sede, string $codigo): array
    {
        return $this->returnQuery('EXEC sp_buscarTransfStock ?, ?', [$sede, $codigo]);
    }

    public function listaFiles(string $solicitud): array
    {
        return $this->returnQuery('EXEC sp_listarDocumentosSolicitud ?', [$solicitud]);
    }
}
