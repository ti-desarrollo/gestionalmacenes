<?php

session_start();
date_default_timezone_set('America/Lima');
if (isset($_REQUEST)) {
    require_once('../models/Usuario.php');
    $usuario = new Usuario();

    switch ($_REQUEST['task']) {
        case 1:
            // Inicio de sesión
            $response = [];
            $result = $usuario->login($_POST['usuario'], $_POST['password']);
            if (sizeof($result) == 1) {
                $hour = date('H:m');
                if ($hour > '07:30' && $hour < '18:00') {
                    $_SESSION['ga-idUsu'] = $result[0]['id'];
                    $_SESSION['ga-naUsu'] = $result[0]['naUsuario'];
                    $_SESSION['ga-usuario'] = $result[0]['usuario'];
                    $_SESSION['ga-idSedeUsu'] = $result[0]['idSede'];
                    $_SESSION['ga-sedeUsu'] = $result[0]['descSede'];
                    $_SESSION['ga-perfilUsu'] = $result[0]['perfil'];
                    $_SESSION['ga-idPerfilUsu'] = $result[0]['idPerfil'];
                    $response = [
                        'success' => true,
                        'message' => '::MENSAJE:\n[*] Inicio de sesión exitoso'
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => '::ERROR:\n[*] Estás fuera del horario permitido para el acceso al aplicativo'
                    ];
                }
            } else {
                $response = [
                    'success' => false,
                    'message' => '::ERROR:\n[*] Credenciales no válidas, por favor intenta otra vez'
                ];
            }
            echo json_encode($response);
            break;

        case 2:
            // Cerrar sesión
            $_SESSION = [];
            session_destroy();
            break;

        case 3:
            // Guardar token para notificaciones
            echo json_encode($usuario->guardarToken($_POST['token'], $_SESSION['ga-usuario'], $_SESSION['ga-idPerfilUsu']));
            break;

        case 4:
            // Leer token para notificaciones
            echo json_encode($usuario->leerToken());
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
