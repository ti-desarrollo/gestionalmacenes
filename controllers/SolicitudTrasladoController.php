<?php

session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/SolicitudTraslado.php');
    $solicitud = new SolicitudTraslado();

    switch ($_REQUEST['task']) {
        case 1:
            // Listar las solicitudes
            echo json_encode($solicitud->listarSolicitudes($_SESSION['ga-idSedeUsu'], $_GET['fechaI'], $_GET['fechaF']));
            break;

        case 2:
            // Listar los detalles de una solicitud
            echo json_encode($solicitud->listarDetalle($_SESSION['ga-idSedeUsu'], $_GET['docentry']));
            break;

        case 3:
            // Registrar las cantidades de una ST
            $response = [];
            $i = 0;
            $estado = $solicitud->obtenerEstado($_POST['docentry']);
            if ($estado[0]['U_AMQ_ESTADO_ST'] <> 'P') {
                foreach ($_POST['arrayItems'] as $filaItem) {
                    $aux = $solicitud->actualizarDetalle($_POST['docentry'], $filaItem[0], $filaItem[1], $filaItem[2]);
                    $i = $i + $aux;
                }

                if (sizeof($_POST['arrayItems']) <> $i) {
                    $response['message'] = '::MENSAJE:\n[*] El procesamiento no se completó';
                } else {
                    if ($solicitud->actualizarCabecera($_POST['observacion'], $_POST['conformidad'], $_POST['docentry'])) {
                        $response['message'] = '::MENSAJE:\n[*] Procesamiento exitoso';
                    } else {
                        $response['message'] = '::ERROR:\n[*] Las cantidades fueron actualizadas pero no el estado de la cabecera';
                    }
                }
            } else {
                $response['message'] = '::ERROR:\n[*] Verifica el estado de la solicitud de traslado';
            }

            $response['valor'] = $i;
            echo json_encode($response);
            break;

        case 5:
            // Subir archivo
            echo json_encode($solicitud->uploadFile($_FILES['file']));
            break;

        case 6:
            // Insertar archivo
            echo json_encode($solicitud->insertarFile($_POST['archivo'], $_POST['solicitud']));
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
