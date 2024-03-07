<?php

require_once 'Conexion.php';

class Soldadura extends Conexion
{

    public function __construct()
    {
        parent::__construct();
    }
    
    public function listarPesajes(int $sede): array
    {
        $data = $this->returnQuery('EXEC sp_listarPesajes ?', [$sede]);
        return $data;
    }

    public function listarPesajesDetalle(int $id): array
    {
        $data = $this->returnQuery('EXEC sp_listarPesajesDetalle ?', [$id]);
        return $data;
    }

    public function listarSobrantes(int $sede): array
    {
        $data = $this->returnQuery('EXEC sp_listarSobrantes ?', [$sede]);
        return $data;
    }

    public function listarSobranteDetalle(int $id): array
    {
        $data = $this->returnQuery('EXEC sp_listarSobrantesDetalle ?', [$id]);
        return $data;
    }

    public function registrarSoldadura(string $sede, int $cantidad, string $descripcion, string $empaque, string $peso, string $fecha, string $responsable): array
    {
        $response = [];
        $data = $this->insertPesajes($sede, $cantidad, $descripcion, $empaque, $peso, $fecha, $responsable);
        $carpeta = $this->listaCarpeta($sede);

        if ($data > 0)
        {
            return  $response = ['success' => true, 'message' => 'Pesaje procesado', 'data' => ['cabecera' => $data, 'carpeta' => $carpeta[0]["Folder"], 'usuario' => $responsable]];
        }
        return $response = ['success' => true, 'message' => 'Pesaje procesado', 'data' => ['cabecera' => $data, 'carpeta' => $carpeta, 'usuario' => $responsable]];
        
    }

    private function insertPesajes($sede, $cantidad, $descripcion, $empaque, $peso, $fecha, $responsable)
    {
        $data = $this->simpleQuery("INSERT INTO soldadura (Cantidad, Descripcion, Peso, Empaque, Fecha_Pesaje, Fecha_Registro, Sede, Responsable, estado_b) VALUES ($cantidad, '$descripcion', $peso, '$empaque', '$fecha', GETDATE(), '$sede', '$responsable', 1);", [$sede, $cantidad, $descripcion, $empaque, $peso, $fecha, $responsable]);
        // Obtenemos el id insertado
        $lastID = $this->lastId();
        return $lastID['idInsertado'];
        //return $data;
    }

    private function listaCarpeta($sede)
    {
        $data = $this->returnQuery('SELECT dbo.getFolderName(?) AS Folder', [$sede]);
        return $data;
    }

    public function registrarSobrantes(string $sede, int $cantidad, string $descripcion, string $peso, string $fecha, string $responsable): array
    {
        $response = [];
        $data = $this->insertSobrante($sede, $cantidad, $descripcion, $peso, $fecha, $responsable);
        $carpeta = $this->listaCarpeta($sede);

        if ($data > 0)
        {
            return  $response = ['success' => true, 'message' => 'Sobrante procesado', 'data' => ['cabecera' => $data, 'carpeta' => $carpeta[0]["Folder"], 'usuario' => $responsable]];
        }
        return $response = ['success' => true, 'message' => 'Sobrante procesado', 'data' => ['cabecera' => $data, 'carpeta' => $carpeta[0]["Folder"], 'usuario' => $responsable]];
    }

    private function insertSobrante($sede, $cantidad, $descripcion, $peso, $fecha, $responsable)
    {
        $data = $this->simpleQuery("INSERT INTO varillas_sobrantes (Cantidad, Descripcion, Peso, Fecha_Pesaje, Fecha_Registro, Sede, Responsable, estado_b) VALUES ($cantidad, '$descripcion', $peso, '$fecha', GETDATE(), '$sede', '$responsable', 1);", [$sede, $cantidad, $descripcion, $peso, $fecha, $responsable]);
        // Obtenemos el id insertado
        $lastID = $this->lastId();
        return $lastID['idInsertado'];
        //return $data;
    }

    public function eliminarPesaje(int $id): int | bool
    {
        $data = $this->simpleQuery('EXEC sp_elimninarSoldadura ?', [$id]);
        return $data;
    }

    public function eliminarPesajeSobrante(int $id): int | bool
    {
        $data = $this->simpleQuery('EXEC sp_elimninarSoldaduraSobrante ?', [$id]);
        return $data;
    }

    private function listarArchivos(string $codigo, string $guia): array
    {
        return $this->returnQuery('sp_listarDocumentosPedido ?, ?', [$codigo, $guia]);
    }

    public function uploadFile(int $cabecera, string $dir, array $data): array
    {
        $directorio = "\\\amseq-files\\ALMACEN - TIENDA\\$dir";
        $file = json_decode(json_encode($data));
        $name = date('Ymd_his_') . str_replace(' ', '_', $file->name);
        $location = $directorio . '/' . $name;
        $file_extension = strtolower(pathinfo($location, PATHINFO_EXTENSION));
        $extensions = ['pdf', 'png', 'jpg', 'jpeg'];

        // Validamos que no haya sido cargado previamente
        $valido = $this->validateFileName($dir, $file->name);
        if (!$valido['success']) {
            return $valido;
        }
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
                    if ($this->insertFile($name, $cabecera) > 0) {
                        return ['success' => true, 'message' => $name];
                    }
                    return ['success' => false, 'message' => "El archivo $name fue subido, pero hubo un error al insertar. Por favor intente otra vez"];
                }
                return ['success' => false, 'message' => "No se pudo subir el archivo $name, por el siguiente motivo: {$file->error}"];
            }
            return ['success' => false, 'message' => 'Archivo no permitido'];
        }
        return ['success' => false, 'message' => 'El directorio no se puede escribir o no existe. Directorio: ' .  $directorio];
    }

    public function uploadFileSobrante(int $cabecera, string $dir, array $data): array
    {
        $directorio = "\\\amseq-files\\ALMACEN - TIENDA\\$dir";
        $file = json_decode(json_encode($data));
        $name = date('Ymd_his_') . str_replace(' ', '_', $file->name);
        $location = $directorio . '/' . $name;
        $file_extension = strtolower(pathinfo($location, PATHINFO_EXTENSION));
        $extensions = ['pdf', 'png', 'jpg', 'jpeg'];

        // Validamos que no haya sido cargado previamente
        $valido = $this->validateFileName($dir, $file->name);
        if (!$valido['success']) {
            return $valido;
        }
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
                    if ($this->insertFileSobrante($name, $cabecera) > 0) {
                        return ['success' => true, 'message' => $name];
                    }
                    return ['success' => false, 'message' => "El archivo $name fue subido, pero hubo un error al insertar. Por favor intente otra vez"];
                }
                return ['success' => false, 'message' => "No se pudo subir el archivo $name, por el siguiente motivo: {$file->error}"];
            }
            return ['success' => false, 'message' => 'Archivo no permitido'];
        }
        return ['success' => false, 'message' => 'El directorio no se puede escribir o no existe. Directorio: ' .  $directorio];
    }

    private function validateFileName(string $dir, string $fileName): array
    {
        // $directorio = "\\\amseq-files\\ALMACEN - TIENDA\\$dir";
        // if (file_exists($directorio)) {
        //     $files = array_diff(scandir($directorio), array('.', '..'));
        //     foreach ($files as $x) {
        //         if (substr($x, 16) === $fileName) {
        //             return ['success' => false, 'message' => "El archivo $fileName ya está cargado. Intenta con otro archivo"];
        //             break;
        //         }
        //     }
        // }
        return ['success' => true, 'message' => "El archivo $fileName es válido"];
    }

    private function insertFile(string $archivo, string $soldadura): int | bool
    {
        return $this->simpleQuery('INSERT INTO documentos_soldadura VALUES(?, ?)', [$soldadura, $archivo]);
    }

    private function insertFileSobrante(string $archivo, string $soldadura): int | bool
    {
        return $this->simpleQuery('INSERT INTO documentos_varilla VALUES(?, ?)', [$soldadura, $archivo]);
    }

    public function notificadorSoldadura(int $sede): array
    {
        return $this->returnQuery("SELECT id FROM varillas_sobrantes WHERE Sede = ? AND CAST(Fecha_Pesaje AS DATE) = CAST(GETDATE() AS DATE) AND estados IS NULL ORDER BY id DESC", [$sede]);
    }

    public function enviarCorreo(string $body, string $recipients, string $subject): int | bool
    {
        $this->simpleQuery("EXECUTE [10.2.3.30].msdb.dbo.sp_send_dbmail @profile_name = 'PerfilEnvioCorreos2023', @body = ?, @body_format ='HTML', @recipients = ?, @subject = ?;", [$body, $recipients, $subject]);
        return 1;
    }

    public function listaConformidad(int $sede): array
    {
        $data = $this->returnQuery('EXEC sp_listarConformidad ?', [$sede]);
        return $data;
    }

    public function layout(string $codigo): array
    {
        return $this->returnQuery('EXEC SBO_3AAMSEQ.dbo.SYP_LYT_COMOC01 ?', [$codigo]);
    }

    public function confirmar(int $codigo, string $sede, string $operacion, int $estado, string $comentarios, string $fecha): array
    {
        $response = [];
        $data = $this->returnQuery('EXEC sp_confirmar ?, ?, ?, ?, ?, ?', [$codigo, $sede, $operacion, $estado, $comentarios, $fecha]);
        
        return  $response = ['success' => true, 'message' => 'Sobrante confirmado', 'data' => ['cabecera' => $operacion, 'estado' => $estado]];
    }
}
