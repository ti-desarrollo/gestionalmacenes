<?php
date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'], $_SESSION['ga-idUsu'])) {
    header('Location: index.php');
} else {
?>
    <!DOCTYPE html>
    <html lang="es">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="">
        <meta name="author" content="">
        <title>3AAMSEQ SA - Gestión de Almacén</title>
        <link href="media/logotipo.ico" rel="shortcut icon" type="image/ico">

        <!-- Bootstrap CSS -->
        <link href="libs/bootstrap/css/bootstrap.min.css" rel="stylesheet">

        <!-- Icons -->
        <link href="libs/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

        <!-- Estilos -->
        <link href="libs/css/sb-admin.css" rel="stylesheet">
        <link href="libs/css/estilos.css" rel="stylesheet">

        <!-- SweetAlert2 CSS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.9.0/sweetalert2.min.css" integrity="sha512-IScV5kvJo+TIPbxENerxZcEpu9VrLUGh1qYWv6Z9aylhxWE4k4Fch3CHl0IYYmN+jrnWQBPlpoTVoWfSMakoKA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

        <!-- Bootstrap JS -->
        <script src="libs/jquery/jquery.min.js"></script>
        <script src="libs/bootstrap/js/bootstrap.min.js"></script>

        <!-- Easing JS -->
        <script src="libs/jquery-easing/jquery.easing.min.js"></script>

        <!-- SweetAlert2 JS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.9.0/sweetalert2.all.min.js" integrity="sha512-LTmGiRLYz7G5Sxr4MMXGaOfia3kGZKGAlXzrSCGc4GBGxymu1RGwhFFGwiOQUm+bJOGlV0AmHd1S7zeFlwzkFQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

        <!-- Funciones propias -->
        <script src="libs/js/funciones/usuario.js"></script>
    </head>

    <body class="bg-dark">
        <div class="container">
            <div class="card card-login mx-auto mt-5">
                <div class="card-header text-center">
                    <h3>Gestión de almacenes</h3>
                </div>
                <div class="card-body">
                    <form id="formSesion">
                        <div class="form-group">
                            <label for="txtUsuario">Usuario</label>
                            <input class="form-control form-control-sm" id="txtUsuario" name="txtUsuario" type="text" placeholder="Ingrese su usuario">
                        </div>
                        <div class="form-group">
                            <label for="txtClave">Contraseña</label>
                            <input class="form-control form-control-sm" id="txtClave" name="txtClave" type="password" placeholder="Ingrese su contraseña">
                        </div>
                        <button type="button" id="btnLogin" class="btn btn-primary btn-block btn-sm" onclick="login()"><i class="fa fa-fw fa-sign-in"></i>INGRESAR</button>
                    </form>
                    <div class="text-center">
                        <br><b>Nota:</b> El acceso al sistema está disponible desde las 7:30am hasta las 6:00pm
                    </div>
                </div>
            </div>
        </div>

        <script src="./firebase-app.js"></script>
        <script src="./firebase-messaging.js"></script>
        <script src="./firebase-messaging-sw.js"></script>
        <script>
            var tokenFCM = "";
            if (firebase.messaging.isSupported()) {
                messaging
                    .getToken({
                        vapidKey: "BNKgkUDdgAOdz-4U-wG6vtkGk9QepgwJOy7uAuWf7dQQW6aW1lYLHS2fj1_7_EldcpcZZUbriCXAo6VsDwEdCr4",
                    })
                    .then((token) => {
                        if (token) {
                            tokenFCM =
                                token;
                        } else {
                            console.log(
                                "No registration token available. Request permission to generate one."
                            );
                        }
                    })
                    .catch((err) => {
                        console.log("An error occurred while retrieving token. ", err);
                    });
            }
        </script>
    </body>

    </html>
<?php
}
?>