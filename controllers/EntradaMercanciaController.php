<?php

session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/EntradaMercancia.php');
    $entrada = new EntradaMercancia();

    switch ($_REQUEST['task']) {
        case 1:
            // Listar las entradas de mercancía por sede
            echo json_encode($entrada->listarEntradas($_SESSION['ga-idSedeUsu'], $_POST['fechaI'], $_POST['fechaF']));
            break;

        case 2:
            // Listar el detalle de una entrada
            echo json_encode($entrada->listarDetalle($_POST['sede'] ?? $_SESSION['ga-idSedeUsu'],  $_POST['docentry']));
            break;

        case 3:
            // Lista los archivos de un pedido
            echo json_encode($entrada->listarDocumentosPedido($_POST['pedido'], $_POST['guia']));
            break;

        case 4:
            // Listar datos para layout de entrada
            echo json_encode($entrada->layout($_POST['docentry']));
            break;

        case 5:
            // Listar las entradas de mercancía para administrativos
            echo json_encode($entrada->listarEntradasAdm($_POST['fechaI'], $_POST['fechaF']));
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
