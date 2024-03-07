<?php

require_once 'Conexion.php';

class TransferenciaStock extends Conexion
{

    public function __construct()
    {
        parent::__construct();
    }

    public function paginacion(string $inicio, string $fin, string $search, string | null $sede): int
    {
        $total = 0;
        $sedeFilter = $sede ? " AND " . DATABASE_SAP . ".dbo.sededeAlmacen((SELECT TOP 1 X.WhsCode FROM " . DATABASE_SAP . ".dbo.WTR1 X WHERE T0.DocEntry = X.DocEntry)) = '$sede' " : "";

        $result = $this->returnQuery("SELECT
                COUNT(T0.DocEntry) count 
            FROM " . DATABASE_SAP . ".dbo.OWTR T0 WITH(NOLOCK) 
            INNER JOIN " . DATABASE_SAP . ".dbo.OWHS T1 WITH(NOLOCK) ON T0.ToWhsCode = T1.WhsCode
            WHERE  
                T0.CANCELED = 'N' AND 
                T0.DocStatus = 'O' AND 
                T0.InvntSttus = 'O'	AND 
                T1.U_SYP_TALM = 'LO' AND 
                T0.DocDate BETWEEN CONVERT(DATE, ?) AND CONVERT(DATE, ?) AND
                (
                    T0.DocNum LIKE '%' + ? + '%' OR
                    CONCAT(T0.U_SYP_SDGR, '-', SUBSTRING(T0.U_SYP_CDGR, PATINDEX('%[^0]%', T0.U_SYP_CDGR), LEN(T0.U_SYP_CDGR))) LIKE '%' + ? + '%'
                )
                $sedeFilter
                ", [$inicio, $fin, $search, $search]);
        if (count($result) > 0) {
            $total = $result[0]['count'];
        }
        return $total;
    }

    public function listarTransferencias_A(string $inicio, string $fin, string $search, int $page, int $limit): array
    {
        $startFrom = ($page - 1) * $limit;
        $data = $this->returnQuery('sp_listarTransfStockAdm ?, ?, ?, ?, ?, ?', [DATABASE_SAP, $inicio, $fin, $search, $startFrom, $limit]);
        foreach ($data as $transferencia => &$valor) {
            $adjuntos = '';
            $numeroSolicitud = '';
            $solicitud = $this->buscarSolicitd($valor['guiaSolicitud']);
            if (count($solicitud) > 0) {
                $codigoSolicitud = $solicitud[0]['codigoSolicitud'];
                $numeroSolicitud = $solicitud[0]['numeroSolicitud'];
                $files = $this->archivosSolicitud($codigoSolicitud);
                foreach ($files as $file) {
                    $adjuntos .= "<p style='margin: unset;'><a href='" . LINK_ARCHIVOS . "/{$file['carpeta']}/RECEPCIÓN DE MERCADERÍA - ALMACÉN/{$file['year']}/{$file['mes']}/TRANSFERENCIAS/{$file['origen']}/{$file['fechaFormato']}/{$file['fileName']}' target='_blank'>{$file['fileName']}</a></p>";
                }
            }
            $valor['adjuntos'] = $adjuntos;
            $valor['solicitud'] = $numeroSolicitud;
        }
        return $data;
    }

    public function listarTransferencias(string $sede, string $inicio, string $fin, string $search, int $page, int $limit): array
    {
        $startFrom = ($page - 1) * $limit;
        $data = $this->returnQuery('sp_listarTransfStock ?, ?, ?, ?, ?, ?, ?', [DATABASE_SAP, $sede, $inicio, $fin, $search, $startFrom, $limit]);
        foreach ($data as $transferencia => &$valor) {
            $adjuntos = '';
            $numeroSolicitud = '';
            $solicitud = $this->buscarSolicitd($valor['guiaSolicitud']);
            if (count($solicitud) > 0) {
                $codigoSolicitud = $solicitud[0]['codigoSolicitud'];
                $numeroSolicitud = $solicitud[0]['numeroSolicitud'];
                $files = $this->archivosSolicitud($codigoSolicitud);
                foreach ($files as $file) {
                    $adjuntos .= "<p style='margin: unset;'><a href='" . LINK_ARCHIVOS . "/{$file['carpeta']}/RECEPCIÓN DE MERCADERÍA - ALMACÉN/{$file['year']}/{$file['mes']}/TRANSFERENCIAS/{$file['origen']}/{$file['fechaFormato']}/{$file['fileName']}' target='_blank'>{$file['fileName']}</a></p>";
                }
            }
            $valor['adjuntos'] = $adjuntos;
            $valor['solicitud'] = $numeroSolicitud;
        }
        return $data;
    }

    public function buscarDetalle(string $sede, string $codigo): array
    {
        return $this->returnQuery('sp_buscarTransfStock ?, ?, ?', [DATABASE_SAP, $sede, $codigo]);
    }

    private function buscarSolicitd(string | null $guia): array
    {
        return $this->returnQuery("SELECT TOP 1 DocEntry AS codigoSolicitud, DocNum AS numeroSolicitud FROM " . DATABASE_SAP . ".dbo.OWTQ WHERE CONCAT(U_SYP_TPGR, '-', U_SYP_SDGR, '-', SUBSTRING(U_SYP_CDGR, PATINDEX('%[^0]%', U_SYP_CDGR), LEN(U_SYP_CDGR))) = ?", [$guia]);
    }

    private function archivosSolicitud(string|null $solicitud): array
    {
        return $this->returnQuery('sp_listarDocumentosSolicitud ?, ?', [DATABASE_SAP, $solicitud]);
    }
}
