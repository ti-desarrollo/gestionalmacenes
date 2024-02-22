const controller = "controllers/UsuarioController.php";

let tokenFCM = null;
document.addEventListener("DOMContentLoaded", () => {
  // Obtener usuario
  document.getElementById("txtUsuario").value =
    localStorage.getItem("usuarioga3a") ?? "";
    
  if (firebase.messaging.isSupported()) {
    messaging
      .getToken({
        vapidKey:
          "BNKgkUDdgAOdz-4U-wG6vtkGk9QepgwJOy7uAuWf7dQQW6aW1lYLHS2fj1_7_EldcpcZZUbriCXAo6VsDwEdCr4",
      })
      .then((token) => {
        if (token) {
          tokenFCM = token;
        } else {
          Swal.fire({
            icon: "error",
            title: "¡Uy!",
            text: "No registration token available. Request permission to generate one.",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "¡Uy!",
          text: `An error occurred while retrieving token. Error: ${err}`,
        });
      });
  }
});

document.getElementById("formSesion").onsubmit = function (e) {
  e.preventDefault();

  const usuario = document.getElementById("txtUsuario").value.trim();
  const password = document.getElementById("txtClave").value.trim();

  // Validar guardar datos de acceso
  if (document.getElementById("remeber").checked) {
    localStorage.setItem("usuarioga3a", usuario);
  }

  const button = document.getElementById("btnLogin");
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

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
        Swal.fire({
          icon: "error",
          title: "¡Uy!",
          text: data.message,
        });
      }
    }
  );
};

function logout() {
  const task = 2;
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
      $.post(`../../${controller}`, { task }, function () {
        location.reload();
      });
    }
  });
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
