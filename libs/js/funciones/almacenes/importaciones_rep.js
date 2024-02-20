const controllerI = "../../controllers/ImportacionesController.php";

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
  tbody.innerHTML = `<tr><td colspan="11"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

  const fechaI = document.getElementById("txtFechaI").value;
  const fechaF = document.getElementById("txtFechaF").value;
  const task = 1;

  $.post(controllerI, { task, fechaI, fechaF }, function (response) {
    const datos = JSON.parse(response);
    tbody.innerHTML = "";
    let color = "";
    if (datos.length > 0) {
      datos.forEach((element) => {
        color = element.conformidad === "Conforme" ? "#28a745" : "#F44336";
        tbody.innerHTML += `
          <tr id="row${element.codigo}">
            <td class="text-primary" onclick="readRecepcion(${element.codigo})">${element.codigo}</td>    
            <td>${element.estado}</td>        
            <td>${element.pedido}</td>
            <td>${element.operacion}</td>
            <td>${element.proveedor}</td>
            <td>${element.sede}</td>
            <td>${element.fecha}</td>
            <td>${element.grr}</td>
            <td>${element.grt}</td>
            <td>${element.ticket}</td>
            <td><b style="background: ${color}; padding: 5px; color: #ffffff; border-radius: 5px;">${element.conformidad}</b></td>
          </tr>`;
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="11">Sin resultados</td></tr>`;
    }

    button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
  });
}

function readRecepcion(recepcion) {
  rowSelected(recepcion);
  const task = 6;
  $.post(controllerI, { task, recepcion }, function (response) {
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
