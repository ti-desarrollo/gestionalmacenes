const controller = "controllers/UsuarioController.php";

function login() {
  const button = document.getElementById("btnLogin");
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

  const usuario = document.getElementById("txtUsuario").value.trim();
  const password = document.getElementById("txtClave").value.trim();
  const task = 1;

  $.post(
    controller,
    {
      task,
      usuario,
      password,
    },
    function (response) {
      button.innerHTML = '<i class="fa fa-fw fa-sign-in"></i>INGRESAR';
      const data = JSON.parse(response);
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
  const task = 2;
  if (
    confirm("::CONFIRMACIÓN:\n[*] ¿Está seguro que desea cerrar su sesión?")
  ) {
    $.post(`../../${controller}`, { task }, function () {
      location.reload();
    });
  }
}

function guardarToken(token) {
  const task = 3;
  $.post(
    controller,
    {
      task,
      token,
    },
    function (_) {}
  );
}
