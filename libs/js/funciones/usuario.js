function login() {
  $("#btnLogin").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $.post(
    "controllers/UsuarioController.php",
    {
      task: 1,
      usuario: $("#txtUsuario").val(),
      password: $("#txtClave").val(),
    },
    function (response) {
      $("#btnLogin").html('<i class="fa fa-fw fa-sign-in"></i>INGRESAR');
      let data = $.parseJSON(response);
      if (data.success) {
        guardarToken(tokenFCM);
        location.reload();
      } else {
        alert(data.message);
      }
    }
  );
}

function logout() {
  if (
    confirm("::CONFIRMACIÓN:\n[*] ¿Está seguro que desea cerrar su sesión?")
  ) {
    $.post(
      "../../controllers/UsuarioController.php",
      { task: 2 },
      function () {
        location.reload();
      }
    );
  }
}

function guardarToken(token) {
  $.post(
    "controllers/UsuarioController.php",
    {
      task: 3,
      token,
    },
    function (_) {}
  );
}
