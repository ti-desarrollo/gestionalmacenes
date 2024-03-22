<?php

require_once 'Conexion.php';

class SolicitudTraslado extends Conexion
{

    public function __construct()
    {
        parent::__construct();
    }

    public function listarSolicitudes_A(string $inicio, string $fin): array
    {
        $data = $this->returnQuery('sp_listarSoliTrasladoAdm ?, ?, ?', [DATABASE_SAP, $inicio, $fin]);
        foreach ($data as $solicitud => &$valor) {
            $adjuntos = '';
            $files = $this->listarArchivos($valor['docentry']);
            foreach ($files as $file) {
                $adjuntos .= "<p style='margin: unset;'><a href='" . LINK_ARCHIVOS . "/{$file['carpeta']}/RECEPCIÓN DE MERCADERÍA - ALMACÉN/{$file['year']}/{$file['mes']}/TRANSFERENCIAS/{$file['origen']}/{$file['fechaFormato']}/{$file['fileName']}' target='_blank'>{$file['fileName']}</a></p>";
            }
            $valor['adjuntos'] = $adjuntos;
        }
        return $data;
    }

    public function listarSolicitudes(string $sede, string $inicio, string $fin): array
    {
        $data = $this->returnQuery('sp_listarSoliTraslado ?, ?, ?, ?', [DATABASE_SAP, $sede, $inicio, $fin]);
        foreach ($data as $solicitud => &$valor) {
            $adjuntos = '';
            $files = $this->listarArchivos($valor['docentry']);
            foreach ($files as $file) {
                $adjuntos .= "<p style='margin: unset;'><a href='" . LINK_ARCHIVOS . "/{$file['carpeta']}/RECEPCIÓN DE MERCADERÍA - ALMACÉN/{$file['year']}/{$file['mes']}/TRANSFERENCIAS/{$file['origen']}/{$file['fechaFormato']}/{$file['fileName']}' target='_blank'>{$file['fileName']}</a></p>";
            }
            $valor['adjuntos'] = $adjuntos;
        }
        return $data;
    }

    public function buscarDetalle(string $sede, string $codigo): array
    {
        return $this->returnQuery('sp_buscarSoliTraslado ?, ?, ?', [DATABASE_SAP, $sede, $codigo]);
    }

    public function procesarSolicitud(string $codigo, string $guia, string $comentarios, string $conformidad, string $usuario, array $items): array
    {
        $response = [];
        $guia = str_replace('GRT', '31', $guia);
        if ($this->obtenerEstado($codigo)[0]['estado'] !== 'P') {
            $cabecera = $this->actualizarCabecera($codigo, $comentarios, $conformidad,  $guia, $usuario);
            if ($cabecera > 0) {
                $isUpdate = true;
                foreach ($items as $item) {
                    if ($this->actualizarDetalle($cabecera, $codigo, $item['item'], $item['cantidadRecibida']) <= 0) {
                        $isUpdate = false;
                        break;
                    }
                }

                if ($isUpdate) {
                    $response = ['success' => true, 'message' => 'Solicitud procesada', 'data' => ['cabecera' => $cabecera, 'usuario' => $usuario]];
                } else {
                    $response = ['success' => false, 'message' => 'Hubo un error al procesar la solicitud. Por favor, comuníquese con sistemas'];
                }
            } else {
                $response = ['success' => false, 'message' => 'Hubo un error al procesar la solicitud. Por favor, comuníquese con sistemas'];
            }
        } else {
            $response = ['success' => false, 'message' => 'Esta solicitud ya fue RECEPCIONADA anteriormente'];
        }
        return $response;
    }

    private function obtenerEstado(string $codigo): array
    {
        return $this->returnQuery('SELECT U_AMQ_ESTADO_ST estado FROM ' . DATABASE_SAP . '.dbo.OWTQ WHERE DocEntry = ?', [$codigo]);
    }

    private function actualizarCabecera(string $codigo, string $comentarios, string $conformidad, string $guia, string $usuario): int | bool
    {
        // Actualizamos la cebecera en SAP
        $this->simpleQuery("sp_actualizarCabeceraSolicitudTraslado ?, ?, ?, ?", [DATABASE_SAP, $codigo, $comentarios, $conformidad]);

        // Insertamos los datos en el aplicativo
        $this->simpleQuery("INSERT INTO recepcion_solicitud_traslado_cabecera(rstc_solicitud, rstc_guia, rstc_usuario) VALUES($codigo, '$guia', '$usuario');", []);

        // Obtenemos el id insertado
        $lastID = $this->lastId();
        return $lastID['idInsertado'];
    }

    private function actualizarDetalle(string $cabecera, string $codigo, string $itemcode, string $cantidad): int | false
    {
        return $this->simpleQuery('sp_actualizarDetalleSolicitudTraslado ?, ?, ?, ?, ?', [DATABASE_SAP, $cabecera, $codigo, $itemcode, $cantidad]);
    }

    private function listarArchivos(string $solicitud): array
    {
        return $this->returnQuery('sp_listarDocumentosSolicitud ?, ?', [DATABASE_SAP, $solicitud]);
    }

    public function uploadFile(int $solicitud, string $dir, array $data): array
    {
        $directorio = "\\\amseq-files\\ALMACEN - TIENDA\\$dir";
        $file = json_decode(json_encode($data));
        $name = date('Ymd_his_') . str_replace(' ', '_', $file->name);
        $location = $directorio . '/' . $name;
        $file_extension = strtolower(pathinfo($location, PATHINFO_EXTENSION));
        $extensions = ['pdf', 'png', 'jpg', 'jpeg'];

        // Verificar si la ruta de destino existe
        if (!file_exists($directorio)) {
            // Si no existe, intenta crearla
            if (!mkdir($directorio, 0777, true)) {
                // Si no se puede crear la ruta de destino, muestra un mensaje de error
                return ['success' => false, 'message' => 'El directorio no se puede escribir o no existe. Directorio: ' .  $directorio];
            }
        }

        if (is_dir($directorio . '/') && is_writable($directorio . '/')) {
            if (in_array($file_extension, $extensions)) {
                if (move_uploaded_file($file->tmp_name, $location)) {
                    if ($this->insertFile($name, $solicitud) > 0) {
                        return ['success' => true, 'message' => $name];
                    }
                    return ['success' => false, 'message' => "El archivo $name fue subido, pero hubo un error al insertar. Por favor intente otra vez"];
                }
                return ['success' => false, 'message' => "No se pudo subir el archivo $name, por el siguiente motivo: {$file->error}"];
            }
            return ['success' => false, 'message' => 'Archivo no permitido'];
        }
        return ['success' => false, 'message' => 'El directorio no se puede escribir o no existe'];
    }

    private function insertFile($archivo, $solicitud): int | bool
    {
        return $this->simpleQuery('INSERT INTO documentos_solicitud VALUES(?, ?)', [$solicitud, $archivo]);
    }

    public function enviarCorreo(string $body, string $recipients, string $subject): int | bool
    {
        $this->simpleQuery("[10.2.3.30].msdb.dbo.sp_send_dbmail @profile_name = 'PerfilEnvioCorreos2023', @body = ?, @body_format ='HTML', @recipients = ?, @subject = ?;", [$body, $recipients, $subject]);
        return 1;
    }
}
