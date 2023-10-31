document.addEventListener("DOMContentLoaded", () => {
  // Configuramos el buscador
  document.getElementById("txtFilter").onkeyup = function (e) {
    filterTable(e.target.value, document.getElementById("tbdl"));
  };

  // Configuramos el botón de búsqueda
  document.getElementById("btnR").onclick = listar;

  // Abrir/Cerrar
  document.getElementById("closeDetalle").onclick = () => {
    document.getElementById("dl").style.display = "block";
    document.getElementById("dd").style.display = "none";
  };

  // Traemos los datos
  listar();
});

const controllerPE_A = "../../controllers/PedidoController.php";

function listar() {
  const tbody = document.getElementById("tbdl");
  const button = document.getElementById("btnR");
  tbody.innerHTML = `<tr><td colspan="14"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

  let fechaI = document.getElementById("txtFechaI").value;
  let fechaF = document.getElementById("txtFechaF").value;
  const task = 1;
  $.post(
    controllerPE_A,
    {
      task,
      fechaI,
      fechaF,
    },
    function (response) {
      const datos = JSON.parse(response);
      tbody.innerHTML = "";
      if (datos.length > 0) {
        datos.forEach((element) => {
          tbody.innerHTML += `
          <tr id="row${element.codigo}_${element.guia}">
              <td class="text-primary" onclick="verDetalle(${element.codigo}, '${element.sedeCodigo}', '${element.guia}')">${element.codigo}</td>
              <td>${element.estado}</td>
              <td>${element.conformidad}</td>
              <td>${element.usuario}</td>
              <td>${element.pedido}</td>
              <td>${element.guia}</td>
              <td>${element.rucTransportista}</td>
              <td>${element.rzTransportista}</td>
              <td>${element.formaEnvio}</td>
              <td>${element.proveedor}</td>
              <td>${element.fechaEntrega}</td>
              <td>${element.fechaRecepcion}</td>
              <td>${element.sede}</td>       
              <td>${element.adjuntos}</td>             
          </tr>
      `;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="13">Sin resultados</td></tr>`;
      }
      button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
    }
  );
}

function verDetalle(docentry, sede, guia) {
  /**Agregar clase para saber que fila fue la que abrimos */
  rowSelected(`${docentry}_${guia}`);

  const tbody = document.getElementById("tbd");
  tbody.innerHTML = "";
  document.getElementById("dl").style.display = "none";
  document.getElementById("dd").style.display = "block";
  const task = 3;
  $.post(controllerPE_A, { task, docentry, sede, guia }, function (response) {
    const datos = JSON.parse(response);

    if (datos.length > 0) {
      document.getElementById("txtGuia").value = datos[0].guia;
      document.getElementById("txtNumDoc").value = datos[0].documento;
      document.getElementById("txtFechaDoc").value = datos[0].fecha;
      document.getElementById("txtEstado").value = datos[0].estado;
      document.getElementById("txtConformidad").value =
        datos[0].conformidad === "01" ? "CONFORME" : "NO CONFORME";
      document.getElementById("txtComentario").value = datos[0].observacion;
      if (datos[0].estadoCabecera === 1) {
        document.getElementById(
          "btnRechazar"
        ).innerHTML = `<button type="button" class="btn btn-danger btn-sm" onclick='rechazarRecepcion(${JSON.stringify(
          datos
        )});'><i class="fa fa-fw fa-close"></i> Rechazar recepción</button>`;
      } else {
        document.getElementById("btnRechazar").innerHTML = "";
      }
      datos.forEach((element, index) => {
        let color = element.cantidadRecibida > 0 ? "#4caf50" : "#f44336";
        tbody.innerHTML += `
            <tr>
                <td style="vertical-align: middle">${index + 1}</td>
                <td style="vertical-align: middle">${element.item}</td>
                <td style="vertical-align: middle">${element.descripcion}</td>
                <td style="vertical-align: middle">${element.um}</td>
                <td style="vertical-align: middle"><div style="background: ${color}; border-radius: 10px; color: white;  font-weight: bold;">${
          element.cantidadPedida
        }</div></td>
                <td style="vertical-align: middle"><div style="background: ${color}; border-radius: 10px; color: white;  font-weight: bold;">${
          element.cantidadRecibida
        }</div></td>
                <td style="vertical-align: middle"><div style="background: ${color}; border-radius: 10px; color: white;  font-weight: bold;">${
          element.cantidadRecepcionada
        }</div></td>
            </tr>
            `;
      });
    }
  });
}

function rechazarRecepcion(datos) {
  const pedido = datos[0].codigo;
  const cabecera = datos[0].codigoRecepcion;
  const guia = datos[0].guia;
  const items = [];
  datos.forEach((element) => {
    items.push({
      item: element.item,
      cantidad: element.cantidadRecibida,
    });
  });
  const task = 12;

  Swal.fire({
    text: "Ingres el motivo del rechazo",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
      required: true,
    },
    showCancelButton: true,
    confirmButtonText: "Si, rechazar",
    cancelButtonText: "No, cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    showLoaderOnConfirm: true,
    preConfirm: (comentarios) => {
      if (!comentarios) {
      }
      return $.post(
        controllerPE_A,
        {
          task,
          pedido,
          cabecera,
          guia,
          items,
          comentarios,
        },
        function (response) {
          return JSON.parse(response);
        }
      );
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      const response = JSON.parse(result.value);
      Swal.fire({
        icon: response.success ? "success" : "error",
        title: response.message,
      });
      listar();
      document.getElementById("closeDetalle").click();
    }
  });
}
