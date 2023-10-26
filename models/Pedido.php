<?php

require_once 'Conexion.php';

class Pedido extends Conexion
{

    public function __construct()
    {
        parent::__construct();
    }

    public function listarPedidos(string $sede, string $inicio, string $fin): array
    {
        return $this->returnQuery('EXEC sp_listarPedidos ?, ?, ?', [$sede, $inicio, $fin]);
    }

    public function listarDetalle(string $sede, string $codigo, string $guia): array
    {
        return $this->returnQuery('EXEC sp_buscarPedido ?, ?, ?', [$sede, $codigo, $guia]);
    }

    public function obtenerEstado(string $codigo): array
    {
        return $this->returnQuery('SELECT U_AMQ_ESTADO_OC FROM SBO_3AAMSEQ.dbo.OPOR WHERE DocEntry = ?', [$codigo]);
    }

    public function layout(string $codigo): array
    {
        return $this->returnQuery('EXEC SBO_3AAMSEQ.dbo.SYP_LYT_COMOC01 ?', [$codigo]);
    }

    public function listarPedidosAdm(string $inicio, string $fin): array
    {
        $dato = $this->returnQuery('EXEC sp_listarPedidosAdministrativos ?, ?', [$inicio, $fin]);
        $pedidos = [];
        foreach ($dato as $pedido) {
            $pedido['documentos'] =  $this->listarArchivos($pedido['codigoRecepcion']);
            array_push($pedidos, $pedido);
        }
        return $pedidos;
    }

    public function listarArchivos(string $codigo): array
    {
        return $this->returnQuery('SELECT dp_documento FROM documentos_pedido WHERE dp_pedido = ?', [$codigo]);
    }

    public function actualizarDetalle(string $cabecera, string $codigo, string $itemcode, string $cantidad): int |bool
    {
        return $this->simpleQuery('EXEC sp_actualizarDetallePedido ?, ?, ?, ?', [$cabecera, $codigo, $itemcode, $cantidad]);
    }

    public function actualizarCabecera(string $codigo, string $guia, string $estado, string $comentarios, string $conformidad, string $usuario): int | bool
    {
        // Actualizamos la cebecera en SAP
        $guiaDatos = explode('-', $guia);
        $this->simpleQuery('EXEC sp_actualizarCabeceraPedido ?, ?, ?, ?, ?, ?, ?', [$codigo, $guiaDatos[0], $guiaDatos[1], $guiaDatos[2], $estado, $comentarios, $conformidad]);

        // Insertamos en el aplicativo
        $this->simpleQuery("INSERT INTO recepcion_pedido_cabecera(rpc_pedido, rpc_conformidad, rpc_usuario, rpc_guia_grr, rpc_estado, rpc_comentario) VALUES($codigo, '$conformidad', '$usuario', '$guia', '$estado', '$comentarios');", []);

        // Obtenemos el id insertado
        $lastID = $this->lastId();
        return $lastID['idInsertado'];
    }

    public function uploadFile(array $data, string $sede, string $year, string $mes, string $proveedor, string $fechaRecepcion): array
    {
        $directorio = "\\\amseq-files\\ALMACEN - TIENDA\\$sede\RECEPCIÓN DE MERCADERÍA - ALMACÉN\\$year\\$mes\\COMPRAS NACIONALES\\$proveedor\\$fechaRecepcion";
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
                    return ['success' => true, 'message' => $name];
                }
                return ['success' => false, 'message' => "No se pudo subir el archivo $name, por el siguiente motivo: {$file->error}"];
            }
            return ['success' => false, 'message' => 'Archivo no permitido'];
        }
        return ['success' => false, 'message' => 'El directorio no se puede escribir o no existe. Directorio: ' .  $directorio];
    }

    public function insertarFile(string $archivo, string $pedido): int | bool
    {
        return $this->simpleQuery('INSERT INTO documentos_pedido VALUES(?, ?)', [$pedido, $archivo]);
    }

    public function enviarCorreo(string $body, string $recipients, string $subject): int | bool
    {
        $this->simpleQuery("EXECUTE [10.2.3.30].msdb.dbo.sp_send_dbmail @profile_name = 'PerfilEnvioCorreos2023', @body = ?, @body_format ='HTML', @recipients = ?, @subject = ?;", [$body, $recipients, $subject]);
        return 1;
    }

    public function validateFilesnames(array $data, string $sede, string $year, string $mes, string $proveedor, string $fechaRecepcion): array
    {
        $directorio = "\\\amseq-files\ALMACEN - TIENDA\\$sede\RECEPCIÓN DE MERCADERÍA - ALMACÉN\\$year\\$mes\\COMPRAS NACIONALES\\$proveedor\\$fechaRecepcion";
        $file = json_decode(json_encode($data));
        $fileName = $file->name;
        if (file_exists($directorio)) {
            $files = array_diff(scandir($directorio), array('.', '..'));
            foreach ($files as $x) {
                if (substr($x, 16) === $fileName) {
                    return ['success' => false, 'message' => "El archivo $fileName ya está cargado. Intenta con otro archivo"];
                    break;
                }
            }
        }
        return ['success' => true, 'message' => "El archivo $fileName es válido"];
    }
}
