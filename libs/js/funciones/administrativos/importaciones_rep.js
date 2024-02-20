const controllerIA = "../../controllers/ImportacionesController.php";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("txtFilter").onkeyup = function (e) {
    filterTable(e.target.value, document.getElementById("tbdl"));
  };

  document.getElementById("btnR").onclick = listar;

  listar();
});

function listar() {
  const tbody = document.getElementById("tbdl");
  const button = document.getElementById("btnR");
  tbody.innerHTML = `<tr><td colspan="12"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

  const fechaI = document.getElementById("txtFechaI").value;
  const fechaF = document.getElementById("txtFechaF").value;
  const task = 1;

  $.post(controllerIA, { task, fechaI, fechaF }, function (response) {
    const datos = JSON.parse(response);
    tbody.innerHTML = "";
    let color = "";
    if (datos.length > 0) {
      datos.forEach((element) => {
        color = element.conformidad === "Conforme" ? "#28a745" : "#F44336";
        tbody.innerHTML += `
          <tr id="row${element.codigo}">
            <td class="text-primary" onclick="readRecepcion(${
              element.codigo
            })">${element.codigo}</td>    
            <td>${element.estado}</td>        
            <td>${element.pedido}</td>
            <td>${element.operacion}</td>
            <td>${element.proveedor}</td>
            <td>${element.sede}</td>
            <td>${element.fecha}</td>
            <td>${element.grr}</td>
            <td>${element.grt}</td>
            <td>${element.ticket}</td>
            <td><b style="background: ${color}; padding: 5px; color: #ffffff; border-radius: 5px; display: flex; justify-content: center;">${
          element.conformidad
        }</b></td>
            <td>${
              element.conformidad === "No conforme" &&
              !element.adjuntoNoConformidad
                ? `<i class="fa fa-fw fa-upload" style="color: #F44336; font-size: large; cursor: pointer;" onclick="subirNoConformidad(${element.codigo}, '${element.grr}', '${element.dirNoConformidad}')"></i>`
                : ""
            }</td>
          </tr>`;
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="12">Sin resultados</td></tr>`;
    }

    button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
  });
}

function readRecepcion(recepcion) {
  rowSelected(recepcion);
  const task = 6;
  $.post(controllerIA, { task, recepcion }, function (response) {
    const datos = JSON.parse(response);

    if (datos.length === 0) {
      Swal.fire({
        icon: "error",
        title: "¡Uy!",
        text: "No se encontraron datos de la recepción, intenta nuevamente",
      }).then((result) => {
        if (result.isConfirmed) {
          divdl.style.display = "block";
          divdd.style.display = "none";
        }
      });
    }
    Object.keys(datos[0]).forEach((key) => {
      const input = document.getElementById(
        `txt${key.charAt(0).toUpperCase() + key.slice(1)}`
      );
      if (input) input.value = datos[0][key];
    });

    const file1 = document.getElementById("txtGRTAdjunto");
    const file2 = document.getElementById("txtGRRAdjunto");
    const file3 = document.getElementById("txtTicketAdjunto");
    const file4 = document.getElementById("txtAdjuntoNoConformidad");
    const UsuarioNoCo = document.getElementById("UsuarioNoCo");
    const FechaNoCo = document.getElementById("FechaNoCo");

    file1.href = datos[0]["GRTAdjunto"];
    file2.href = datos[0]["GRRAdjunto"];
    file3.href = datos[0]["TicketAdjunto"];
    file4.href = datos[0]["AdjuntoNoConformidad"];

    if (datos[0]["AdjuntoNoConformidad"] === null) {
      file4.style.visibility = "hidden";
      UsuarioNoCo.style.display = "none";
      FechaNoCo.style.display = "none";
    } else {
      file4.style.visibility = "visible";
      UsuarioNoCo.style.display = "block";
      FechaNoCo.style.display = "block";
    }

    $("#mdlLayout").modal("toggle");
  });
}

function subirNoConformidad(codigo, grr, directorio) {
  rowSelected(codigo);
  $("#mdlLayoutNoConformidad").modal("toggle");
  document.getElementById("formNoConformidad").onsubmit = function (e) {
    e.preventDefault();
    Swal.fire({
      title: "¿Está seguro de procesar los datos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, procesar",
      cancelButtonText: "No, cancelar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        let result;
        let file = document.getElementById("noConformidadAjunto").files[0];
        const task = 8;
        const formData = new FormData();
        formData.append("task", task);
        formData.append("codigo", codigo);
        formData.append("grr", grr);
        formData.append("directorio", directorio);
        formData.append("file", file);
        await $.ajax({
          url: controllerIA,
          dataType: "text",
          cache: false,
          contentType: false,
          processData: false,
          data: formData,
          type: "post",
          success: function (response) {
            result = JSON.parse(response);
          },
        });
        return result;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = result.value;
        Swal.fire({
          icon: response.success ? "success" : "error",
          title: response.message,
        }).then((result) => {
          if (result.isConfirmed) {
            readRecepcion(codigo);
          }
        });

        listar();
        $("#mdlLayoutNoConformidad").modal("hide");
      }
    });
  };
}
