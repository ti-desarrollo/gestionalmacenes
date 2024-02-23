<?php

session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/EntradaMercancia.php');
    $entrada = new EntradaMercancia();

    switch ($_REQUEST['task']) {
        case 1:
            // Paginación
            echo json_encode($entrada->paginacion($_POST['fechaI'], $_POST['fechaF'], $_POST['search'], $_POST['flag'] === "0" ? $_SESSION['ga-sede'] : null));
            break;

        case 2:
            // Listar las entradas de mercancía para administrativos
            echo json_encode($entrada->listarEntradas_A($_POST['fechaI'], $_POST['fechaF'], $_POST['search'], $_POST['page'], $_POST['limit']));
            break;

        case 3:
            // Listar las entradas de mercancía por sede
            echo json_encode($entrada->listarEntradas($_SESSION['ga-sede'], $_POST['fechaI'], $_POST['fechaF'], $_POST['search'], $_POST['page'], $_POST['limit']));
            break;

        case 4:
            // Buscar el detalle de una entrada
            echo json_encode($entrada->buscarDetalle($_POST['sede'] ?? $_SESSION['ga-sede'],  $_POST['docentry']));
            break;

        case 5:
            // Listar datos para layout de entrada
            echo json_encode($entrada->layout($_POST['docentry']));
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
