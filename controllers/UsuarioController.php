<?php

session_start();
date_default_timezone_set('America/Lima');
if (isset($_REQUEST)) {
    require_once('../models/Usuario.php');
    $usuario = new Usuario();

    switch ($_REQUEST['task']) {
        case 1:
            // Inicio de sesión
            echo json_encode($usuario->login($_POST['usuario'], $_POST['password']));
            break;

        case 2:
            // Cerrar sesión            
            $usuario->cerrarSesion($_SESSION['ga-sesion']);
            $_SESSION = [];
            session_destroy();
            break;

        case 3:
            // Guardar token para notificaciones
            echo json_encode($usuario->abrirSesion($_SESSION['ga-usuario'], $_SESSION['ga-area'], $_POST['token'], $_SESSION['ga-correo']));
            break;

        case 4:
            // Leer token para notificaciones
            echo json_encode($usuario->leerSesiones());
            break;

        default:
            echo json_encode('Tarea no implementada');
            break;
    }
} else {
    header('../index.php');
}
