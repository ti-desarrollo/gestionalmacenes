<?php

session_start();
if (isset($_REQUEST, $_SESSION)) {
    require_once('../models/SolicitudTraslado.php');
    $solicitud = new SolicitudTraslado();

    switch ($_REQUEST['task']) {
        case 1:
            // Listar las solicitudes
            echo json_encode($solicitud->listarSolicitudes($_SESSION['ga-idSedeUsu'], $_POST['fechaI'], $_POST['fechaF']));
            break;

        case 2:
            // Listar los detalles de una solicitud
            echo json_encode($solicitud->listarDetalle($_POST['sede'] ??$_SESSION['ga-idSedeUsu'], $_POST['docentry']));
            break;

        case 3:
            // Registrar las cantidades de una ST
            $response = [];
            $i = 0;
            $estado = $solicitud->obtenerEstado($_POST['docentry']);
            $lastId = 0;
            if ($estado[0]['U_AMQ_ESTADO_ST'] === 'NP') {
                $lastId = $solicitud->actualizarCabecera($_POST['observacion'], $_POST['conformidad'], $_POST['docentry'], $_POST['guiaT'], $_SESSION['ga-usuario']);
                if ($lastId > 0) {
                    foreach ($_POST['arrayItems'] as $filaItem) {
                        $aux = $solicitud->actualizarDetalle($_POST['docentry'], $filaItem[0], $filaItem[1], $filaItem[2], $lastId);
                        $i = $i + $aux;
                    }
                    $response = ['success' => true, 'message' => '::MENSAJE:\n[*] Solicitud procesada'];
                } else {
                    $response = ['success' => false, 'message' => '::ERROR:\n[*] Hubo error al procesar la solicitud. Por favor comunicarse con sistemas'];
                }
            } else {
                $response = ['success' => false, 'message' => '::ERROR:\n[*] Verifica el estado de la solicitud de traslado'];
            }

            $response['valor'] = $i;
            $response['lastId'] = $lastId;
            $response['usuario'] = $_SESSION['ga-naUsu'];
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

        case 7:
            // Enviar correo para notificar procesamiento de una solicitud
            echo json_encode($solicitud->enviarCorreo($_POST['body'], $_POST['recipients'], $_POST['subject']));
            break;

        case 8:
            // Listar las solicitudes para administrativos
            echo json_encode($solicitud->listarSolicitudesAdm($_POST['fechaI'], $_POST['fechaF']));
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
