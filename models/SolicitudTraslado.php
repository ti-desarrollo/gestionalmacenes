<?php

require_once 'Conexion.php';

class SolicitudTraslado extends Conexion
{

    public function __construct()
    {
        parent::__construct();
    }

    public function listarSolicitudes(string $sede, string $inicio, string $fin): array
    {
        return $this->returnQuery('EXEC sp_listarSoliTraslado ?, ?, ?', [$sede, $inicio, $fin]);
    }

    public function listarDetalle(string $sede, string $codigo): array
    {
        return $this->returnQuery('EXEC sp_buscarSoliTraslado ?, ?', [$sede, $codigo]);
    }

    public function obtenerEstado(string $codigo): array
    {
        return $this->returnQuery('SELECT U_AMQ_ESTADO_ST FROM UpgradeBPS_SBO_3AAMSEQ.dbo.OWTQ WHERE DocEntry = ?', [$codigo]);
    }

    public function actualizarDetalle(string $codigo, string $linea, string $itemcode, string $cantidad): int | false
    {
        return $this->simpleQuery('EXEC sp_actualizarDetalleSolicitudTraslado ?, ?, ?, ?', [$codigo, $linea, $itemcode, $cantidad]);
    }

    public function actualizarCabecera($observacion, $conformidad, $codigo): int | bool
    {
        return $this->simpleQuery("UPDATE UpgradeBPS_SBO_3AAMSEQ.dbo.OWTQ SET U_AMQ_ESTADO_ST = 'P', JrnlMemo = ?,  U_SYP_CONFORMIDAD= ? WHERE DocEntry = ?", [$observacion, $conformidad, $codigo]);
    }

    public function uploadFile(array $data): array
    {
        $directorio = '../docs/solicitudTraslado';
        $file = json_decode(json_encode($data));
        $name = date('Ymd_his_') . str_replace(' ', '_', $file->name);
        $location = $directorio . '/' . $name;
        $file_extension = strtolower(pathinfo($location, PATHINFO_EXTENSION));
        $extensions = ['pdf'];
        if (is_dir($directorio . '/') && is_writable($directorio . '/')) {
            if (in_array($file_extension, $extensions)) {
                if (move_uploaded_file($file->tmp_name, $location)) {
                    return ['success' => true, 'message' => $name];
                }
                return ['success' => false, 'message' => "No se pudo subir el archivo $name, por el siguiente motivo: {$file->error}"];
            }
            return ['success' => false, 'message' => 'Archivo no permitido'];
        }
        return ['success' => false, 'message' => 'El directorio no se puede escribir o no existe'];
    }

    public function insertarFile($archivo, $solicitud): int | bool
    {
        return $this->simpleQuery('INSERT INTO documentos_solicitud VALUES(?, ?)', [$solicitud, $archivo]);
    }
}
