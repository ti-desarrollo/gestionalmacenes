<?php

session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/TransferenciaStock.php');
    $transferencia = new TransferenciaStock();

    switch ($_REQUEST['task']) {
        case 1:
            // Listar las transferencias
            if (in_array($_SESSION['ga-idPerfilUsu'], [1, 2])) {
                echo json_encode($transferencia->listarTransferenciasAdm($_POST['fechaI'], $_POST['fechaF']));
            } else {
                echo json_encode($transferencia->listarTransferencias($_SESSION['ga-idSedeUsu'], $_POST['fechaI'], $_POST['fechaF']));
            }
            break;

        case 2:
            // Listar los detalles de una transferencia
            echo json_encode($transferencia->listarDetalle($_POST['sede'] ?? $_SESSION['ga-idSedeUsu'], $_POST['docentry']));
            break;

        case 3:
            // Listar los archivos de la solicitud asociada a la transferencia
            echo json_encode($transferencia->listaFiles($_POST['solicitud']));
            break;

        case 4:
            // Listar las transferencias
            echo json_encode($transferencia->listarTransferenciasAdm($_POST['fechaI'], $_POST['fechaF']));
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
