<?php

session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/SolicitudTraslado.php');
    $solicitud = new SolicitudTraslado();

    switch ($_REQUEST['task']) {
        case 1:
            // Listar las solicitudes para administrativos
            echo json_encode($solicitud->listarSolicitudes_A($_POST['fechaI'], $_POST['fechaF']));
            break;

        case 2:
            // Listar las solicitudes
            echo json_encode($solicitud->listarSolicitudes($_SESSION['ga-sede'], $_POST['fechaI'], $_POST['fechaF']));
            break;

        case 3:
            // Listar los detalles de una solicitud
            echo json_encode($solicitud->buscarDetalle($_POST['sede'] ?? $_SESSION['ga-sede'], $_POST['docentry']));
            break;

        case 4:
            // Procesar solicitud de traslado
            echo json_encode($solicitud->procesarSolicitud($_POST['docentry'], $_POST['guiaT'], $_POST['comentarios'], $_POST['conformidad'], $_SESSION['ga-usuario'], $_POST['items']));
            break;

        case 5:
            // Subir archivo
            echo json_encode($solicitud->uploadFile($_POST['solicitud'], $_POST['dir'], $_FILES['file']));
            break;

        case 6:
            // Enviar correo para notificar procesamiento de una solicitud
            echo json_encode($solicitud->enviarCorreo($_POST['body'], $_POST['recipients'], $_POST['subject']));
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
