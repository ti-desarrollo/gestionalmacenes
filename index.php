<?php
date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'])) {
?>
    <!DOCTYPE html>
    <html lang="es">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="Gestión de almacenes">
        <meta name="author" content="TIC 3AAMSEQ SA">
        <title>3AAMSEQ SA - Gestión de almacenes</title>
        <link href="media/logotipo.ico" rel="shortcut icon" type="image/ico">

        <!-- Bootstrap CSS -->
        <link href="libs/bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <!-- Íconos -->
        <link href="libs/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

        <!-- Estilos -->
        <link href="libs/css/sb-admin.css" rel="stylesheet">
        <link href="libs/css/estilos.css" rel="stylesheet">

        <!-- SweetAlert2 CSS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.9.0/sweetalert2.min.css" integrity="sha512-IScV5kvJo+TIPbxENerxZcEpu9VrLUGh1qYWv6Z9aylhxWE4k4Fch3CHl0IYYmN+jrnWQBPlpoTVoWfSMakoKA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

        <!-- JQuery -->
        <script src="libs/jquery/jquery.min.js"></script>
        <!-- Bootstrap JS-->
        <script src="libs/bootstrap/js/bootstrap.min.js"></script>

        <!-- Easing JS -->
        <script src="libs/jquery-easing/jquery.easing.min.js"></script>

        <!-- SweetAlert2 JS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.9.0/sweetalert2.all.min.js" integrity="sha512-LTmGiRLYz7G5Sxr4MMXGaOfia3kGZKGAlXzrSCGc4GBGxymu1RGwhFFGwiOQUm+bJOGlV0AmHd1S7zeFlwzkFQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    </head>

    <body class="fixed-nav sticky-footer bg-dark" id="page-top">
        <script type="text/javascript">
            function logout() {
                Swal.fire({
                    title: "¿Está seguro de salir?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, salir",
                    cancelButtonText: "No, cancelar",
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.post("controllers/UsuarioController.php", {
                            task: 2
                        }, function() {
                            location.reload();
                        });
                    }
                });
            }
        </script>

        <!-- Navigation-->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
            <a class="navbar-brand" href="index.php">Gestión de almacenes</a>
            <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav navbar-sidenav accordion" id="menuPrincipal">

                    <li class="nav-item" title="Inicio">
                        <a class="nav-link" href="index.php">
                            <i class="fa fa-fw fa-home"></i><span class="nav-link-text"> Inicio</span>
                        </a>
                    </li>

                    <li class="nav-item" title="Tiendas">
                        <a class="nav-link nav-link-collapse collapsed" data-toggle="collapse" data-target="#menuTiendas" href="#">
                            <i class="fa fa-fw fa-list"></i><span class="nav-link-text"> Tiendas</span>
                        </a>
                        <ul class="sidenav-second-level collapse" id="menuTiendas" data-parent="#menuPrincipal">
                            <li>
                                <a class="nav-link-collapse collapsed" data-toggle="collapse" data-target="#collapseMulti1" href="#"><span class="nav-link-text">Almacenes</span></a>
                                <ul class="sidenav-third-level collapse" id="collapseMulti1" data-parent="#menuTiendas">
                                    <li><a href="views/almacenes/solicitudtraslado.php"><span class="nav-link-text">Solicitudes de traslado</span></a></li>
                                    <li><a href="views/almacenes/transferenciastock.php"><span class="nav-link-text">Transferencias de stock</span></a></li>
                                    <li><a href="views/almacenes/pedido.php"><span class="nav-link-text">Pedidos</span></a></li>
                                    <li><a href="views/almacenes/entradamercancia.php"><span class="nav-link-text">Entrada de mercancías</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item" title="Administrativos">
                        <a class="nav-link nav-link-collapse collapsed" data-toggle="collapse" data-target="#menuAdministrativos" href="#">
                            <i class="fa fa-fw fa-building"></i><span class="nav-link-text"> Administrativos</span>
                        </a>
                        <ul class="sidenav-second-level collapse" id="menuAdministrativos" data-parent="#menuPrincipal">
                            <li>
                                <a class="nav-link-collapse collapsed" data-toggle="collapse" data-target="#collapseMulti2" href="#"><span class="nav-link-text">Almacenes</span></a>
                                <ul class="sidenav-third-level collapse" id="collapseMulti2" data-parent="#menuAdministrativos">
                                    <li><a href="views/administrativos/pedido.php"><span class="nav-link-text">Pedidos</span></a></li>
                                    <li><a href="views/administrativos/solicitudtraslado.php"><span class="nav-link-text">Solicitudes de traslado</span></a></li>
                                </ul>
                            </li>
                            <li>
                                <a class="nav-link-collapse collapsed" data-toggle="collapse" data-target="#collapseMulti3" href="#"><span class="nav-link-text">Mesa de partes</span></a>
                                <ul class="sidenav-third-level collapse" id="collapseMulti3" data-parent="#menuAdministrativos">
                                    <li><a href="views/administrativos/entradamercancia.php"><span class="nav-link-text">Entrada de mercancías</span></a></li>
                                    <li><a href="views/administrativos/transferenciastock.php"><span class="nav-link-text">Transferencias de stock</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item" title="Importaciones">
                        <a class="nav-link nav-link-collapse collapsed" data-toggle="collapse" data-target="#menuImportaciones" href="#">
                            <i class="fa fa-fw fa-ship"></i><span class="nav-link-text"> Importaciones</span>
                        </a>
                        <ul class="sidenav-second-level collapse" id="menuImportaciones" data-parent="#menuPrincipal">
                            <li>
                                <a class="nav-link-collapse collapsed" data-toggle="collapse" data-target="#importacionesAlmacenes" href="#"><span class="nav-link-text">Almacenes</span></a>
                                <ul class="sidenav-third-level collapse" id="importacionesAlmacenes" data-parent="#menuImportaciones">
                                    <li><a href="views/almacenes/importaciones_reg.php"><span class="nav-link-text">Registro</span></a></li>
                                    <li><a href="views/almacenes/importaciones_rep.php"><span class="nav-link-text">Reporte</span></a></li>
                                </ul>
                            </li>
                            <li>
                                <a class="nav-link-collapse collapsed" data-toggle="collapse" data-target="#importacionesLogistica" href="#"><span class="nav-link-text">Logística</span></a>
                                <ul class="sidenav-third-level collapse" id="importacionesLogistica" data-parent="#menuImportaciones">
                                    <li><a href="views/administrativos/importaciones_rep.php"><span class="nav-link-text">Reporte</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item" title="Soldadura">
                        <a class="nav-link nav-link-collapse collapsed" data-toggle="collapse" data-target="#menuSoldadura" href="#">
                            <i class="fa fa-fw fa-building"></i><span class="nav-link-text"> Control de Soldadura</span>
                        </a>
                        <ul class="sidenav-second-level collapse" id="menuSoldadura" data-parent="#menuPrincipal">
                            <li>
                                <a class="nav-link-collapse collapsed" data-toggle="collapse" data-target="#soldaduraAlmacenes" href="#"><span class="nav-link-text">Almacenes</span></a>
                                <ul class="sidenav-third-level collapse" id="soldaduraAlmacenes" data-parent="#menuSoldadura">
                                    <li><a href="views/soldadura/pesajes.php"><span class="nav-link-text">Pesaje</span></a></li>
                                    <li><a href="views/soldadura/confirmacion.php"><span class="nav-link-text">Confirmación</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                </ul>

                <ul class="navbar-nav sidenav-toggler">
                    <li class="nav-item">
                        <a class="nav-link text-center" id="sidenavToggler" href="#"><i class="fa fa-fw fa-angle-left"></i></a>
                    </li>
                </ul>

                <ul class="navbar-nav ml-auto">
                    <li class="nav-item" onclick="logout()">
                        <a class="nav-link" data-toggle="modal" data-target="#modalLogout">
                            <i class="fa fa-fw fa-sign-out"></i><span class="nav-link-text"> Cerrar Sesión</span>
                        </a>
                    </li>
                </ul>

            </div>
        </nav>

        <div class="content-wrapper">
            <div class="container-fluid">
                <h2>
                    <i class="fa fa-user-circle"></i> <?php echo $_SESSION["ga-nombres"]; ?> |
                    <i class="fa fa-building-o"></i> <?php echo $_SESSION["ga-ciudad"]; ?>
                </h2>
                <hr>
                <p>
                    Módulos para el control de los almacenes
                </p>
            </div>

            <footer class="sticky-footer">
                <div class="container">
                    <div class="text-center">
                        <small>3AAMSEQ SA © Área de Sistemas - <?php echo date("Y"); ?></small>
                    </div>
                </div>
            </footer>

            <!-- Scroll to Top Button-->
            <a class="scroll-to-top rounded" href="#page-top"><i class="fa fa-angle-up"></i></a>

            <!-- Custom scripts for all pages-->
            <script src="libs/js/sb-admin.min.js"></script>
            <script src="firebase-app.js"></script>
            <script src="firebase-messaging.js"></script>
            <script src="firebase-messaging-sw.js"></script>
            <script>
                messaging.onMessage((payload) => {
                    alert(`${payload.data.body}`);
                });
            </script>
        </div>
    </body>

    </html>
<?php
} else {
    header('Location: login.php');
}
?>