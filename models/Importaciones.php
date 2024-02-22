<?php

require_once 'Conexion.php';

class Importaciones extends Conexion
{

    public function __construct()
    {
        parent::__construct();
    }

    public function reporteImportaciones(string $sede, string $inicio, string $fin): array
    {
        return $this->returnQuery('sp_reporteImportaciones ?, ?, ?', [$sede === '99' ? '' : $sede, $inicio, $fin]);
    }

    public function listarImportaciones(string $sede, string $inicio, string $fin): array
    {
        return $this->returnQuery('sp_listarPedidosImportacion ?, ?, ?', [$sede, $inicio, $fin]);
    }

    public function buscarDetalleImportacion(string $sede, string $pedido, string $usuario): array
    {
        $this->registrarImportacion($sede, $pedido, $usuario);
        return $this->returnQuery('sp_buscarImportacion ?, ?, ?', [$sede, $pedido, $usuario]);
    }

    private function registrarImportacion(string $sede, int $pedido, string $usuario): int | bool
    {
        return $this->insertQuery('sp_registrarImportacion ?, ?, ?', [$sede, $pedido, $usuario]);
    }

    public function buscarRecepcionesPorImportacion(int $importacion, string $sede): array
    {
        return $this->returnQuery('sp_listarRecepcionesPorImportacion ?, ?', [$importacion, $sede]);
    }

    public function buscarDetalleRecepcion(int $recepcion): array
    {
        return $this->returnQuery('sp_buscarRecepcion ?', [$recepcion]);
    }

    public function registrarRecepcion(string $importacion, string $recepciones, string $usuario, string $sede): array
    {
        $importacion = (object) json_decode($importacion, true);
        $recepciones = json_decode($recepciones, true);
        $id = 1;

        $inserted = [];
        $uploadedFiles = [];
        $pesoRecepcionadoTotal = 0;
        $bultosRecepcionadosTotal = 0;
        foreach ($recepciones as $dato) {
            try {
                $recepcion = (object) $dato;
                $recepcion->grrAdjunto = (object) $_FILES["grrAdjunto_$id"];
                $recepcion->grtAdjunto = (object) $_FILES["grtAdjunto_$id"];
                $recepcion->ticketAdjunto = (object) $_FILES["ticketAdjunto_$id"];
                $id++;

                // Procesar la recepción (dato)
                $codigo = $importacion->codigo;
                $grr = str_replace('GRR', '09', $recepcion->grr);
                $grrAdjunto = $this->uploadFile($importacion->dir, $recepcion->grrAdjunto, $grr);
                $grrBultos = (int) $recepcion->grrBultos;
                $grrPeso = (float) $recepcion->grrPeso;
                $grt = str_replace('GRR', '31', $recepcion->grt);
                $grtAdjunto =  $this->uploadFile($importacion->dir, $recepcion->grtAdjunto, $grt);
                $ticket = $recepcion->ticket;
                $ticketAdjunto = $this->uploadFile($importacion->dir, $recepcion->ticketAdjunto, $ticket);
                $ticketBultos = (int) $recepcion->ticketBultos;
                $ticketPeso = (float) $recepcion->ticketPeso;
                $pesoRecepcionado = (float) $recepcion->pesoRecepcionado;
                $bultosRecepcionados = (int) $recepcion->bultosRecepcionados;
                $placaVehiculo = $recepcion->placaVehiculo;
                $conformidad = $recepcion->conformidad;
                $comentario = $recepcion->comentario;
                $dua = $recepcion->dua;
                $ot = $recepcion->ot;
                $agenteAduana = $recepcion->agenteAduana;

                // Guardamos los archivos cargados
                array_push($uploadedFiles, $grrAdjunto, $grtAdjunto, $ticketAdjunto);

                $result = $this->insertQuery('sp_registrarRecepcionImportacion ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?', [
                    $codigo,
                    $grr,
                    $grrAdjunto,
                    $grrBultos,
                    $grrPeso,
                    $grt,
                    $grtAdjunto,
                    $ticket,
                    $ticketAdjunto,
                    $ticketBultos,
                    $ticketPeso,
                    $pesoRecepcionado,
                    $bultosRecepcionados,
                    $placaVehiculo,
                    $conformidad,
                    $comentario,
                    $dua,
                    $ot,
                    $agenteAduana,
                    $usuario,
                    $sede
                ]);

                if (!$result) {
                    throw new Exception('Hubo un error al registrar las importaciones. Intente nuevamente');
                } else {
                    $this->simpleQuery('sp_actualizarImportacionPesoYBultos ?, ?, ?', [$codigo, $pesoRecepcionado, $bultosRecepcionados]);
                    $pesoRecepcionadoTotal +=  $pesoRecepcionado;
                    $bultosRecepcionadosTotal += $bultosRecepcionados;
                    array_push($inserted, $result);
                }
            } catch (Exception $e) {
                $this->rollbackRecepcionImportacion($uploadedFiles, $importacion, $pesoRecepcionadoTotal, $bultosRecepcionadosTotal, $inserted, 'ANULADO POR ERROR AL REGISTRAR');
                return ['success' => false, 'message' => $e->getMessage()];
            }
        }

        return ['success' => true, 'message' => 'Recepciones registradas', 'data' => $importacion->pedido, 'recepcion' => $result];
    }

    public function borrarRecepcion(int $recepcion, string $sede): array
    {
        try {
            $datos = $this->buscarDetalleRecepcion($recepcion, $sede);
            if (count($datos) === 0) {
                throw new Exception('No existe el registro o ya fue anulado por otra persona');
            }

            $file1 = explode('/', $datos[0]['GRRAdjunto'])[12];
            $file2 = explode('/', $datos[0]['GRTAdjunto'])[12];
            $file3 = explode('/', $datos[0]['TicketAdjunto'])[12];
            $fechaNoConformidad = $datos[0]['FechaNoConformidad'];
            $dir = $datos[0]['dir'];
            $importacionCodigo = $datos[0]['importacion'];
            $pedido = (int) $datos[0]['pedido'];
            $pesoRecibido = (float) $datos[0]['PesoRecibido'];
            $bultosRecibidos = (int) $datos[0]['BultosRecibidos'];
            $importacion = (object)[
                'dir' => $dir,
                'codigo' => $importacionCodigo
            ];

            if ($fechaNoConformidad !== null) {
                throw new Exception('Este registro no puede ser anulado');
            }

            $this->rollbackRecepcionImportacion([$file1, $file2, $file3], $importacion, $pesoRecibido, $bultosRecibidos, [$recepcion], 'ANULADO POR EL USUARIO');

            return ['success' => true, 'message' => 'Registro anulado', 'data' => $pedido];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function noConformidad(string $usuario, int $codigo, string $grr, string $directorio, object $file): array
    {
        try {
            $adjunto = $this->uploadFile($directorio, $file, "NO CONFORMIDAD $grr");
            if ($this->simpleQuery('sp_subirNoConformidad ?, ?, ?', [$codigo, $usuario, $adjunto])) {
                return ['success' => true, 'message' => 'Archivo cargado'];
            }
            return ['success' => false, 'message' => 'Hubo un error al cargar el archivo.'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    private function uploadFile(string $dir, object $file, string $name): string
    {
        try {
            $directorio = "\\\amseq-files\\ALMACEN - TIENDA\\$dir";
            $fileExtension = strtolower(pathinfo($file->name, PATHINFO_EXTENSION));
            $fileNname = date('Ymd_his_') . str_replace(' ', '_', $name) . '.' . $fileExtension;
            $location = $directorio . '/' . $fileNname;
            $file_extension = strtolower(pathinfo($location, PATHINFO_EXTENSION));
            $extensions = ['pdf', 'png', 'jpg', 'jpeg'];

            // Verificar si la ruta de destino existe
            if (!file_exists($directorio)) {
                // Si no existe, intenta crearla
                if (!mkdir($directorio, 0777, true)) {
                    // Si no se puede crear la ruta de destino, muestra un mensaje de error
                    throw new Exception("El directorio no se puede escribir o no existe. Directorio: $directorio", 400);
                }
            }

            if (is_dir($directorio . '/') && is_writable($directorio . '/')) {
                if (in_array($file_extension, $extensions)) {
                    if (move_uploaded_file($file->tmp_name, $location)) {
                        return $fileNname;
                    }
                    throw new Exception("No se pudo subir el archivo $fileNname, por el siguiente motivo: {$file->error}", 400);
                }
                throw new Exception("Tipo de archivo no permitido", 400);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function rollbackRecepcionImportacion(array $uploadedFiles, object $importacion, float $pesoRecepcionadoTotal, int $bultosRecepcionadosTotal, array $inserted, string $comentario): void
    {
        foreach ($uploadedFiles as $file) {
            unlink("\\\amseq-files\\ALMACEN - TIENDA\\$importacion->dir\\$file");
        }
        $this->simpleQuery('sp_actualizarImportacionPesoYBultos ?, ?, ?', [$importacion->codigo, ($pesoRecepcionadoTotal * -1), ($bultosRecepcionadosTotal * -1)]);
        foreach ($inserted as $line) {
            $this->simpleQuery('sp_anularRecepcion ?, ?', [$line, $comentario]);
        }
    }

    public function enviarCorreo(string $body, string $recipients, string $subject): int | bool
    {
        $this->simpleQuery("[10.2.3.30].msdb.dbo.sp_send_dbmail @profile_name = 'PerfilEnvioCorreos2023', @body = ?, @body_format ='HTML', @recipients = ?, @subject = ?;", [$body, $recipients, $subject]);
        return 1;
    }
}
