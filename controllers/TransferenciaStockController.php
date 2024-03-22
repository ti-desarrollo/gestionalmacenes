<?php

session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/TransferenciaStock.php');
    $transferencia = new TransferenciaStock();

    switch ($_REQUEST['task']) {
        case 1:
            echo json_encode($transferencia->paginacion($_POST['fechaI'], $_POST['fechaF'], $_POST['search'], $_POST['flag'] === "0" ? $_SESSION['ga-sede'] : null));
            break;

        case 2:
            echo json_encode($transferencia->listarTransferencias_A($_POST['fechaI'], $_POST['fechaF'], $_POST['search'], $_POST['page'], $_POST['limit']));
            break;

        case 3:
            // Listar los detalles de una transferencia
            echo json_encode($transferencia->listarTransferencias($_SESSION['ga-sede'], $_POST['fechaI'], $_POST['fechaF'], $_POST['search'], $_POST['page'], $_POST['limit']));
            break;

        case 4:
            // Listar los archivos de la solicitud asociada a la transferencia
            echo json_encode($transferencia->buscarDetalle($_POST['sede'] ?? $_SESSION['ga-sede'],  $_POST['docentry']));
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
