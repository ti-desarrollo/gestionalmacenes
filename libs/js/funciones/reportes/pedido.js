const controllerPER = "../../controllers/PedidoController.php";

let txtNumDoc;
let txtFechaDoc;
let txtComentario;

document.addEventListener("DOMContentLoaded", () => {
  // Obtenemos los campos
  txtNumDoc = document.getElementById("txtNumDoc");
  txtFechaDoc = document.getElementById("txtFechaDoc");
  txtComentario = document.getElementById("txtComentario");

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

function listar() {
  const tbody = document.getElementById("tbdl");
  const button = document.getElementById("btnR");
  tbody.innerHTML = `<tr><td colspan="13"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

  let fechaI = document.getElementById("txtFechaI").value;
  let fechaF = document.getElementById("txtFechaF").value;
  const task = 13;
  $.post(
    controllerPER,
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
            <tr id="row${element.codigo}">
              <td class="text-primary" onclick="verDetalle(${element.codigo}, '${element.guia}', '${element.proyecto}')">${element.codigo}</td>
              <td>${element.pedido}</td>
              <td>${element.tipo}</td>
              <td>${element.rucTransportista}</td>
              <td>${element.rzTransportista}</td>
              <td>${element.formaEnvio}</td>
              <td>${element.proveedor}</td>
              <td>${element.fechaEntrega}</td>
              <td>NO PROCESADO</td>
            </tr>`;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="13">Sin resultados</td></tr>`;
      }

      button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
    }
  );
}

function verDetalle(docentry, guia, sede) {
  /**Agregar clase para saber que fila fue la que abrimos */
  rowSelected(docentry);

  const task = 3;
  const tbody = document.getElementById("tbd");
  tbody.innerHTML = "";
  document.getElementById("dl").style.display = "none";
  document.getElementById("dd").style.display = "block";

  $.post(controllerPER, { task, docentry, guia, sede }, function (response) {
    const datos = JSON.parse(response);
    txtNumDoc.value = datos[0].documento;
    txtFechaDoc.value = datos[0].fecha;
    txtComentario.value = datos[0].observacion;

    datos.forEach((element, index) => {
      tbody.innerHTML += `
        <tr>
            <td style="vertical-align: middle">${index + 1}</td>
            <td style="vertical-align: middle">${element.item}</td>
            <td style="vertical-align: middle">${element.descripcion}</td>
            <td style="vertical-align: middle">${element.um}</td>
            <td style="vertical-align: middle">${element.cantidadPedida}</td>
            <td style="vertical-align: middle">${element.cantidadRecibida}</td>
            <td style="vertical-align: middle">${
              element.cantidadRecepcionada
            }</td>
            
        </tr>
        `;
    });
  });
}
