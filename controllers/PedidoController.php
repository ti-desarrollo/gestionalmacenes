<?php
session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/Pedido.php');
    $pedido = new Pedido();

    switch ($_REQUEST['task']) {
        case 1:
            // Listar los pedidos por sede
            echo json_encode($pedido->listarPedidos($_SESSION['ga-idSedeUsu'],  $_POST['fechaI'], $_POST['fechaF']));
            break;

        case 2:
            // Listar el detalle del pedido
            echo json_encode($pedido->listarDetalle($_POST['sede'] ?? $_SESSION['ga-idSedeUsu'], $_POST['docentry']));
            break;

        case 3:
            // Actualizar un pedido
            $response = [];
            $i = 0;
            $estado = $pedido->obtenerEstado($_POST['docentry']);
            $lastId = 0;
            if ($estado[0]['U_AMQ_ESTADO_OC'] <> 'R') {
                $lastId = $pedido->actualizarCabecera($_POST['docentry'], $_POST['guia'], $_POST['estado'], $_POST['comentarios'], $_POST['conformidad']);
                if ($lastId > 0) {
                    foreach ($_POST['items'] as $filaItem) {
                        $aux = $pedido->actualizarDetalle($lastId, $_POST['docentry'], $filaItem['item'], $filaItem['cantidadPendienteRecibida']);
                        $i = $i + $aux;
                    }
                    $response['message'] = '::MENSAJE:\n[*] Pedido procesado';
                } else {
                    $response['message'] = '::ERROR:\n[*] Hubo error al procesar el pedido. Por favor comunicarse con sistemas';
                }
            } else {
                $response['message'] = '::ERROR:\n[*] Este pedido ya fue procesado';
            }

            $response['valor'] = $i;
            $response['lastId'] =  $lastId;
            echo json_encode($response);
            break;

        case 4:
            // Mostrar datos para el layout
            echo json_encode($pedido->layout($_POST['docentry']));
            break;

        case 5:
            // Subir archivo
            echo json_encode($pedido->uploadFile($_FILES['file'], $_POST['sede'], $_POST['year'], $_POST['mes'], $_POST['proveedor'], $_POST['fechaRecepcion']));
            break;

        case 6:
            // Insertar archivo
            echo json_encode($pedido->insertarFile($_POST['archivo'], $_POST['pedido']));
            break;

        case 7:
            // Listar los Pedidos para administrativos
            echo json_encode($pedido->listarPedidosAdm($_POST['fechaI'], $_POST['fechaF']));
            break;

        case 8:
            // Enviar correo para notificar procesamiento de un pedido
            echo json_encode($pedido->enviarCorreo($_POST['body'], $_POST['recipients'], $_POST['subject']));
            break;

        case 9:
            // Validar si el archivo que está subiendo ya existe en la ruta
            echo json_encode($pedido->validateFilesnames($_FILES['file'], $_POST['sede'], $_POST['year'], $_POST['mes'], $_POST['proveedor'], $_POST['fechaRecepcion']));
            break;

        default:
            echo json_encode('Tarea no implementada.');
            break;
    }
} else {
    header('../index.php');
}
