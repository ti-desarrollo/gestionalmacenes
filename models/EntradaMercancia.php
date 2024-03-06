<?php

require_once 'Conexion.php';

class EntradaMercancia extends Conexion
{
    public function __construct()
    {
        parent::__construct();
    }

    public function paginacion(string $inicio, string $fin, string $search, string | null $sede): int
    {
        $total = 0;
        $sedeFilter = $sede ? " AND " . DATABASE_SAP . ".dbo.sededeAlmacen((SELECT TOP 1 X.WhsCode FROM " . DATABASE_SAP . ".dbo.PDN1 X WHERE T0.DocEntry = X.DocEntry)) = '$sede' " : "";

        $result = $this->returnQuery("SELECT 
                COUNT(T0.DocEntry) count 
            FROM " . DATABASE_SAP . ".dbo.OPDN T0 WITH(NOLOCK) 
            WHERE 
                T0.CANCELED = 'N' AND 
                T0.CreateDate BETWEEN CONVERT(DATE, ?) AND CONVERT(DATE, ?) AND
                (
                    T0.DocNum LIKE '%' + ? + '%' OR
                    CONCAT(T0.U_SYP_MDTD, '-', UPPER(T0.U_SYP_MDSD), '-', SUBSTRING(T0.U_SYP_MDCD, PATINDEX('%[^0]%', T0.U_SYP_MDCD), LEN(T0.U_SYP_MDCD))) LIKE '%' + ? + '%'
                )
                $sedeFilter
                ", [$inicio, $fin, $search, $search]);
        if (count($result) > 0) {
            $total = $result[0]['count'];
        }
        return $total;
    }

    public function listarEntradas_A(string $inicio, string $fin, string $search, int $page, int $limit): array
    {
        $startFrom = ($page - 1) * $limit;
        $data = $this->returnQuery('sp_listarEntradaMercanciasAdm ?, ?, ?, ?, ?, ?', [DATABASE_SAP, $inicio, $fin, $search, $startFrom, $limit]);
        foreach ($data as $entrada => &$valor) {
            $adjuntos = '';
            $files = $this->listarDocumentosPedido($valor['docentryPedido'], $valor['guia']);
            foreach ($files as $file) {
                $adjuntos .= "<p style='margin: unset;'><a href='" . LINK_ARCHIVOS . "/{$file['carpeta']}/RECEPCIÓN%20DE%20MERCADERÍA - ALMACÉN/{$file['year']}/{$file['mes']}/COMPRAS NACIONALES/{$file['proveedor']}/{$file['fechaFormato']}/{$file['fileName']}' target='_blank'>{$file['fileName']}</a></p>";
            }
            $valor['adjuntos'] = $adjuntos;
        }
        return $data;
    }

    public function listarEntradas(string $sede, string $inicio, string $fin, string $search, int $page, int $limit): array
    {
        $startFrom = ($page - 1) * $limit;
        $data = $this->returnQuery('sp_listarEntradaMercancias ?, ?, ?, ?, ?, ?, ?', [DATABASE_SAP, $sede, $inicio, $fin, $search, $startFrom, $limit]);
        foreach ($data as $entrada => &$valor) {
            $adjuntos = '';
            $files = $this->listarDocumentosPedido($valor['docentryPedido'], $valor['guia']);
            foreach ($files as $file) {
                $adjuntos .= "<p style='margin: unset;'><a href='" . LINK_ARCHIVOS . "/{$file['carpeta']}/RECEPCIÓN%20DE%20MERCADERÍA - ALMACÉN/{$file['year']}/{$file['mes']}/COMPRAS NACIONALES/{$file['proveedor']}/{$file['fechaFormato']}/{$file['fileName']}' target='_blank'>{$file['fileName']}</a></p>";
            }
            $valor['adjuntos'] = $adjuntos;
        }
        return $data;
    }

    public function buscarDetalle(string $sede, string $codigo): array
    {
        return $this->returnQuery('sp_buscarEntradaMercancia ?, ?, ?', [DATABASE_SAP, $sede, $codigo]);
    }

    private function listarDocumentosPedido(string|null $pedido, string|null $guia): array
    {
        return $this->returnQuery('sp_listarDocumentosPedido ?, ?, ?', [DATABASE_SAP, $pedido, $guia]);
    }

    public function layout(string $docentry,): array
    {
        return $this->returnQuery(DATABASE_SAP . '.dbo.USP_ME_NOTARECEPCION ?', [$docentry]);
    }
}
