<?php
session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/Soldadura.php');
    $soldadura = new Soldadura();

    switch ($_REQUEST['task']) {

        case 1:
            // Listar los pesajes para administrativos
            echo json_encode($soldadura->listarPesajes($_SESSION['ga-sede']));
            break;

        case 2:
            // Listar las sobrantes
            echo json_encode($soldadura->listarSobrantes($_SESSION['ga-sede']));
            break;

        case 3:
            // Registrar Pesaje de soldadura
            echo json_encode($soldadura->registrarSoldadura($_POST['sede'] ?? $_SESSION['ga-sede'], $_POST['txtCantidad'], $_POST['descripcion'], $_POST['empaque'], $_POST['nmbKGTotal'], $_POST['txtFecha'], $_SESSION['ga-usuario']));
            break;
            
        case 4:
            // Registrar sobrante de soldadura
            echo json_encode($soldadura->registrarSobrantes($_POST['sede'] ?? $_SESSION['ga-sede'], $_POST['cantidad'], $_POST['descripcion'], $_POST['nmbKGTotalS'], $_POST['fecha'], $_SESSION['ga-usuario']));
            break;

        case 5:
            // Eliminar pesaje 
            echo json_encode($soldadura->eliminarPesaje($_POST['id']));
            break;

        case 6:
            // Notificar registro de sobrante de soldadura
            echo json_encode($soldadura->notificadorSoldadura($_POST['sede'] ?? $_SESSION['ga-sede']));
            break;

        case 7:
            // Lista de conformidad de soldadura sobrante
            echo json_encode($soldadura->listaConformidad($_SESSION['ga-sede']));
            break;

        case 8:
            // Lista detalle de conformidad de soldadura sobrante
            echo json_encode($soldadura->listaConformidad($_SESSION['ga-sede']));
            break;

        case 9:
            // Dar conformidad de soldadura sobrante
            echo json_encode($soldadura->confirmar($_POST['codigo'], $_POST['sede'] ?? $_SESSION['ga-sede'],  $_POST["operacion"], $_POST["estado"], $_POST["txtComentarios"], $_POST['txtFC']));
            break;

        case 10:
            // Enviar correo para notificar procesamiento de un pedido
            echo json_encode($soldadura->enviarCorreo($_POST['body'], $_POST['recipients'], $_POST['subject']));
            break;

        case 11:
            // Listar Detalle de los pesajes para administrativos
            echo json_encode($soldadura->listarPesajesDetalle($_GET['id']));
            break;

        case 12:
            // Elminar sobrante
            echo json_encode($soldadura->eliminarPesajeSobrante($_POST['id']));
            break;

        case 13:
            // Listar Detalle de los pesajes para administrativos
            echo json_encode($soldadura->listarSobranteDetalle($_GET['id']));
            break;

        case 14:
            // Subir archivo
            echo json_encode($soldadura->uploadFile($_POST['cabecera'], $_POST['dir'], $_FILES['file']));
            break;

        case 15:
            // Subir archivo
            echo json_encode($soldadura->uploadFileSobrante($_POST['cabecera'], $_POST['dir'], $_FILES['file']));
            break;

        case 16:
            // Mostrar datos para el layout
            echo json_encode($soldadura->layout($_POST['docentry']));
            break;

        default:
            echo json_encode('Tarea no implementada.');
            break;
    }
} else {
    header('../index.php');
}
