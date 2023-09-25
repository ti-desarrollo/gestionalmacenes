<?php

require_once 'Conexion.php';

class EntradaMercancia extends Conexion
{
    public function __construct()
    {
        parent::__construct();
    }

    public function listarEntradasAdm(string $inicio, string $fin): array
    {
        return $this->returnQuery('EXEC sp_listarEntradaMercanciasAdm ?, ?', [$inicio, $fin]);
    }

    public function listarEntradas(string $sede, string $inicio, string $fin): array
    {
        return $this->returnQuery('EXEC sp_listarEntradaMercancias ?, ?, ?', [$sede, $inicio, $fin]);
    }

    public function listarDetalle(string $sede, string $codigo): array
    {
        return $this->returnQuery('EXEC sp_buscarEntradaMercancia ?, ?', [$sede, $codigo]);
    }

    public function listarDocumentosPedido(string $pedido, string $guia): array
    {
        return $this->returnQuery('EXEC sp_listarDocumentosPedido ?, ?', [$pedido, "$guia.pdf"]);
    }

    public function layout(string $docentry,): array
    {
        return $this->returnQuery('EXEC SBO_3AAMSEQ_OrdenVenta.dbo.USP_ME_NOTARECEPCION ?', [$docentry]);
    }
}
