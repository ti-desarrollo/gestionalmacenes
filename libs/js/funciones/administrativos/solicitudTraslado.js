const controllerST_A = "../../controllers/SolicitudTrasladoController.php";

let txtGuia;
let txtGuiaT;
let txtNumDoc;
let txtFechaDoc;
let txtEstado;
let txtConformidad;
let txtComentario;

document.addEventListener("DOMContentLoaded", () => {
  // Obtenemos los campos
  txtGuia = document.getElementById("txtGuia");
  txtGuiaT = document.getElementById("txtGuiaT");
  txtNumDoc = document.getElementById("txtNumDoc");
  txtFechaDoc = document.getElementById("txtFechaDoc");
  txtEstado = document.getElementById("txtEstado");
  txtConformidad = document.getElementById("txtConformidad");
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
  const task = 1;
  $.post(
    "../../controllers/SolicitudTrasladoController.php",
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
          tbody.innerHTML += `<tr id="row${element.docentry}">
              <td class="text-primary" onclick="verDetalle(${element.docentry}, '${element.codigoSede}')">${element.docentry}</td>
              <td>${element.guia}</td>
              <td>${element.fecha}</td>
              <td>${element.sede}</td>
              <td>${element.usuario}</td>
              <td>${element.origen}</td>
              <td>${element.destino}</td>
              <td>${element.categoriaVehiculo}</td>
              <td>${element.modalidadTraslado}</td>
              <td>${element.transportista}</td>
              <td>${element.pesoTotal}</td>
              <td>${element.estado}</td>
              <td>${element.adjuntos}</td>
            </tr>`;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="13">Sin resultados</td></tr>`;
      }
      button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
    }
  );
}

function verDetalle(docentry, sede) {
  /**Agregar clase para saber que fila fue la que abrimos */
  rowSelected(docentry);

  const task = 3;
  const tbody = document.getElementById("tbd");
  tbody.innerHTML = "";
  document.getElementById("dl").style.display = "none";
  document.getElementById("dd").style.display = "block";

  $.post(controllerST_A, { task, docentry, sede }, function (response) {
    const datos = JSON.parse(response);
    tbody.innerHTML = "";

    txtGuia.value = datos[0].guia;
    txtGuiaT.value = datos[0].guiaT;
    txtNumDoc.value = datos[0].docnum;
    txtFechaDoc.value = datos[0].fecha;
    txtEstado.value = datos[0].estado;
    txtComentario.value = datos[0].comentarios;
    txtConformidad.value =
      datos[0].conformidad === "01" ? "CONFORME" : "NO CONFORME";
    datos.forEach((element, index) => {
      tbody.innerHTML += `<tr>
            <td style="vertical-align: middle">${index + 1}</td>
            <td style="vertical-align: middle">${element.itemcode}</td>
            <td style="vertical-align: middle">${element.descripcion}</td>
            <td style="vertical-align: middle">${element.cantidad}</td>
            <td style="vertical-align: middle">${element.cantidadRecibida}</td>
          </tr>`;
    });
  });
}
