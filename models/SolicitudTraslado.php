<?php

require_once 'Conexion.php';

class SolicitudTraslado extends Conexion
{

    public function __construct()
    {
        parent::__construct();
    }
    public function listarSolicitudesAdm(string $inicio, string $fin): array
    {
        return $this->returnQuery('EXEC sp_listarSoliTrasladoAdm ?, ?', [$inicio, $fin]);
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
        return $this->returnQuery('SELECT U_AMQ_ESTADO_ST FROM SBO_3AAMSEQ_OrdenVenta.dbo.OWTQ WHERE DocEntry = ?', [$codigo]);
    }

    public function actualizarDetalle(string $codigo, string $linea, string $itemcode, string $cantidad, string $cabecera): int | false
    {
        return $this->simpleQuery('EXEC sp_actualizarDetalleSolicitudTraslado ?, ?, ?, ?, ?', [$cabecera, $codigo, $linea, $itemcode, $cantidad]);
    }

    public function actualizarCabecera(string $observacion, string $conformidad, string $codigo, string $guia, string $usuario): int | bool
    {
        // Actualizamos la cebecera en SAP
        $this->simpleQuery("UPDATE SBO_3AAMSEQ_OrdenVenta.dbo.OWTQ SET U_AMQ_ESTADO_ST = 'P', JrnlMemo = ?,  U_SYP_CONFORMIDAD= ? WHERE DocEntry = ?", [$observacion, $conformidad, $codigo]);

        // Insertamos los datos en el aplicativo
        $this->simpleQuery("INSERT INTO recepcion_solicitud_traslado_cabecera(rstc_solicitud, rstc_guia, rstc_usuario) VALUES($codigo, '$guia', '$usuario');", []);

        // Obtenemos el id insertado
        $lastID = $this->lastId();
        return $lastID['idInsertado'];
    }

    public function uploadFile(array $data): array
    {
        $directorio = '../docs/solicitudTraslado';
        $file = json_decode(json_encode($data));
        $name = date('Ymd_his_') . str_replace(' ', '_', $file->name);
        $location = $directorio . '/' . $name;
        $file_extension = strtolower(pathinfo($location, PATHINFO_EXTENSION));
        $extensions = ['pdf', 'png', 'jpg', 'jpeg'];
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

    public function enviarCorreo(string $body, string $recipients, string $subject): int | bool
    {
        $this->simpleQuery("EXECUTE [10.2.3.30].msdb.dbo.sp_send_dbmail @profile_name = 'PerfilEnvioCorreos2023', @body = ?, @body_format ='HTML', @recipients = ?, @subject = ?;", [$body, $recipients, $subject]);
        return 1;
    }
}
