<?php
session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/Pedido.php');
    $pedido = new Pedido();

    switch ($_REQUEST['task']) {

        case 1:
            // Listar los pedidos para administrativos
            echo json_encode($pedido->listarPedidos_A($_POST['fechaI'], $_POST['fechaF']));
            break;

        case 2:
            // Listar los pedidos por sede
            echo json_encode($pedido->listarPedidos($_SESSION['ga-idSedeUsu'],  $_POST['fechaI'], $_POST['fechaF']));
            break;

        case 3:
            // Listar el detalle del pedido
            echo json_encode($pedido->buscarDetalle($_POST['sede'] ?? $_SESSION['ga-idSedeUsu'], $_POST['docentry'], $_POST['guia']));
            break;

        case 4:
            // Procesamos el pedido
            echo json_encode($pedido->procesarPedido($_POST['codigo'], $_POST['guia'], $_POST['estado'], $_POST['comentarios'], $_POST['conformidad'], $_SESSION['ga-usuario'], $_POST['items']));
            break;

        case 5:
            // Subir archivo
            echo json_encode($pedido->uploadFile($_POST['cabecera'], $_POST['dir'], $_FILES['file']));
            break;

        case 6:
            // Mostrar datos para el layout
            echo json_encode($pedido->layout($_POST['docentry']));
            break;

        case 7:
            // Enviar correo para notificar procesamiento de un pedido
            echo json_encode($pedido->enviarCorreo($_POST['body'], $_POST['recipients'], $_POST['subject']));
            break;

        case 9:
            echo json_encode($pedido->rollbackPedido($_POST['pedido'], $_POST['cabecera'], $_POST['items']));
            break;

        case 10:
            echo json_encode($pedido->listarIngresos($_POST['pedido']));
            break;

        case 11:
            echo json_encode($pedido->buscarDetalleIngreso($_POST['pedido']));
            break;

        case 12:
            echo json_encode($pedido->rechazarRecepcion($_POST['pedido'], $_POST['cabecera'], $_POST['guia'], $_POST['items']));
            break;
        default:
            echo json_encode('Tarea no implementada.');
            break;
    }
} else {
    header('../index.php');
}
