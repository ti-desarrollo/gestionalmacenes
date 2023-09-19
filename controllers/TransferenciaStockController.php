<?php

session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/TransferenciaStock.php');
    $transferencia = new TransferenciaStock();

    switch ($_REQUEST['task']) {
        case 1:
            // Listar las transferencias
            echo json_encode($transferencia->listarTransferencias($_SESSION['ga-idSedeUsu'], $_GET['fechaI'], $_GET['fechaF']));
            break;

        case 2:
            // Listar los detalles de una transferencia
            echo json_encode($transferencia->listarDetalle($_SESSION['ga-idSedeUsu'], $_GET['docentry']));
            break;

        case 3:
            // Listar los archivos de la solicitud asociada a la transferencia
            echo json_encode($transferencia->listaFiles($_GET['solicitud']));
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
