<?php
session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/Importaciones.php');
    $pedido = new Importaciones();

    switch ($_REQUEST['task']) {
        case 1:
            // Listar las importaciones recepcionadas
            echo json_encode($pedido->reporteImportaciones($_SESSION['ga-sede'],  $_POST['fechaI'], $_POST['fechaF']));
            break;

        case 2:
            // Listar los pedidos de importación por sede
            echo json_encode($pedido->listarImportaciones($_SESSION['ga-sede'],  $_POST['fechaI'], $_POST['fechaF']));
            break;

        case 3:
            // Listar el detalle de la importación
            echo json_encode($pedido->buscarDetalleImportacion($_POST['sede'] ?? $_SESSION['ga-sede'], $_POST['docentry'], $_SESSION['ga-usuario']));
            break;

        case 4:
            // Registrar la recepción
            echo json_encode($pedido->registrarRecepcion($_POST['importacion'], $_POST['recepcion'], $_SESSION['ga-usuario'], $_SESSION['ga-sede']));
            break;

        case 5:
            // Buscar la lista de recepciones por importación
            echo json_encode($pedido->buscarRecepcionesPorImportacion($_POST['importacion'], $_SESSION['ga-sede']));
            break;

        case 6:
            // Buscar el detalle de la recepción
            echo json_encode($pedido->buscarDetalleRecepcion($_POST['recepcion']));
            break;

        case 7:
            // Buscar el detalle de la recepción
            echo json_encode($pedido->borrarRecepcion($_POST['recepcion'], $_SESSION['ga-sede']));
            break;

        case 8:
            // Subir la no conformidad de una recepción
            echo json_encode($pedido->noConformidad($_SESSION['ga-usuario'], $_POST['codigo'], $_POST['grr'], $_POST['directorio'], (object) $_FILES['file']));
            break;

        case 9:
            // Enviar correo para notificar procesamiento de un pedido
            echo json_encode($pedido->enviarCorreo($_POST['body'], $_POST['recipients'], $_POST['subject']));
            break;
        default:
            echo json_encode('Tarea no implementada.');
            break;
    }
} else {
    header('../index.php');
}
