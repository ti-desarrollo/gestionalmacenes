<?php
date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'], $_SESSION['ga-idUsu'])) {
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

        <!-- Bootstrap core CSS-->
        <link href="libs/bootstrap-4.5.0-dist/css/bootstrap.min.css" rel="stylesheet">
        <!-- Custom fonts for this template-->
        <link href="libs/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
        <!-- Custom styles for this template-->
        <link href="libs/css/sb-admin.css" rel="stylesheet">
        <link href="libs/css/estilos.css" rel="stylesheet">
        <!-- Bootstrap core JavaScript-->
        <script src="libs/jquery/jquery.min.js"></script>
        <script src="libs/bootstrap-4.5.0-dist/js/bootstrap.min.js"></script>
        <!-- Core plugin JavaScript-->
        <script src="libs/jquery-easing/jquery.easing.min.js"></script>
    </head>

    <body class="fixed-nav sticky-footer bg-dark" id="page-top">
        <script type="text/javascript">
            function logout() {
                if (confirm("::CONFIRMACIÓN:\n[*] ¿Está seguro que desea cerrar su sesión?")) {
                    $.post("controllers/UsuarioController.php", {
                        task: 2
                    }, function() {
                        location.reload();
                    });
                }
            }
        </script>

        <!-- Navigation-->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
            <a class="navbar-brand" href="index.php">Gestión de almacenes</a>
            <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav navbar-sidenav accordion" id="exampleAccordion">

                    <li class="nav-item" title="Inicio">
                        <a class="nav-link" href="index.php">
                            <i class="fa fa-fw fa-home"></i><span class="nav-link-text"> Inicio</span>
                        </a>
                    </li>

                    <li class="nav-item" title="Tiendas">
                        <a class="nav-link nav-link-collapse collapsed" data-toggle="collapse" data-target="#collapseComponents1" href="#">
                            <i class="fa fa-fw fa-list"></i><span class="nav-link-text"> Tiendas</span>
                        </a>
                        <ul class="sidenav-second-level collapse" id="collapseComponents1" data-parent="#exampleAccordion">
                            <li>
                                <a class="nav-link-collapse collapsed" data-toggle="collapse" data-target="#collapseMulti1" href="#"><span class="nav-link-text">Almacenes</span></a>
                                <ul class="sidenav-third-level collapse" id="collapseMulti1" data-parent="#collapseComponents1">
                                    <li><a href="views/almacenes/solicitudtraslado.php"><span class="nav-link-text">Solicitudes de traslado</span></a></li>
                                    <li><a href="views/almacenes/transferenciastock.php"><span class="nav-link-text">Transferencias de stock</span></a></li>
                                    <li><a href="views/almacenes/pedido.php"><span class="nav-link-text">Pedidos</span></a></li>
                                    <li><a href="views/almacenes/entradamercancia.php"><span class="nav-link-text">Entrada de mercancías</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item" title="Administrativos">
                        <a class="nav-link nav-link-collapse collapsed" data-toggle="collapse" data-target="#collapseComponents2" href="#">
                            <i class="fa fa-fw fa-building"></i><span class="nav-link-text"> Administrativos</span>
                        </a>
                        <ul class="sidenav-second-level collapse" id="collapseComponents2" data-parent="#exampleAccordion">
                            <li>
                                <a class="nav-link-collapse collapsed" data-toggle="collapse" data-target="#collapseMulti2" href="#"><span class="nav-link-text">Almacenes</span></a>
                                <ul class="sidenav-third-level collapse" id="collapseMulti2" data-parent="#collapseComponents2">
                                    <li><a href="views/administrativos/pedido.php"><span class="nav-link-text">Pedidos</span></a></li>
                                    <li><a href="views/administrativos/solicitudtraslado.php"><span class="nav-link-text">Solicitudes de traslado</span></a></li>
                                </ul>
                            </li>
                            <li>
                                <a class="nav-link-collapse collapsed" data-toggle="collapse" data-target="#collapseMulti3" href="#"><span class="nav-link-text">Mesa de partes</span></a>
                                <ul class="sidenav-third-level collapse" id="collapseMulti3" data-parent="#collapseComponents2">
                                    <li><a href="views/administrativos/entradamercancia.php"><span class="nav-link-text">Entrada de mercancías</span></a></li>
                                    <li><a href="views/administrativos/transferenciastock.php"><span class="nav-link-text">Transferencias de stock</span></a></li>
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
                    <i class="fa fa-user-circle"></i> <?php echo $_SESSION["ga-naUsu"]; ?> |
                    <i class="fa fa-building-o"></i> <?php echo $_SESSION["ga-sedeUsu"]; ?>
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
                    alert(`::MENSAJE:\n[*] ${payload.data.body}`);
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