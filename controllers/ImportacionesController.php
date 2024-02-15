<?php
session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/Importaciones.php');
    $pedido = new Importaciones();

    switch ($_REQUEST['task']) {
        case 2:
            // Listar los pedidos por sede
            echo json_encode($pedido->listarImportaciones($_SESSION['ga-sede'],  $_POST['fechaI'], $_POST['fechaF']));
            break;

        case 3:
            // Listar el detalle del pedido
            echo json_encode($pedido->buscarDetalle($_POST['sede'] ?? $_SESSION['ga-sede'], $_POST['docentry'], $_SESSION['ga-usuario']));
            break;

        case 4:
            // Procesamos el pedido
            echo json_encode($pedido->procesarImportacion($_POST['importacion'], $_POST['recepcion'], $_SESSION['ga-usuario'], $_SESSION['ga-sede']));
            break;

        default:
            echo json_encode('Tarea no implementada.');
            break;
    }
} else {
    header('../index.php');
}
