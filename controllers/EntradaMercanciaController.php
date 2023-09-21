<?php

session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/EntradaMercancia.php');
    $entrada = new EntradaMercancia();

    switch ($_REQUEST['task']) {
        case 1:
            // Listar las entradas de mercancía por sede
            echo json_encode($entrada->listarEntradas($_SESSION['ga-idSedeUsu'], $_GET['fechaI'], $_GET['fechaF']));
            break;

        case 2:
            // Listar el detalle de una entrada
            echo json_encode($entrada->listarDetalle($_SESSION['ga-idSedeUsu'],  $_GET['docentry']));
            break;

        case 3:
            // Lista los archivos de un pedido
            echo json_encode($entrada->listarDocumentosPedido($_GET['pedido'], $_GET['guia']));
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
