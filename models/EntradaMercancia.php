<?php

require_once 'Conexion.php';

class EntradaMercancia extends Conexion
{
    public function __construct()
    {
        parent::__construct();
    }

    public function listarEntradas(string $sede, string $inicio, string $fin): array
    {
        return $this->returnQuery('EXEC sp_listarEntradaMercancias ?, ?, ?', [$sede, $inicio, $fin]);
    }

    public function listarDetalle(string $sede, string $codigo): array
    {
        return $this->returnQuery('EXEC sp_buscarEntradaMercancia ?, ?', [$sede, $codigo]);
    }

    public function listarDocumentosPedido(string $pedido): array
    {
        return $this->returnQuery('EXEC sp_listarDocumentosPedido ?', [$pedido]);
    }
}
