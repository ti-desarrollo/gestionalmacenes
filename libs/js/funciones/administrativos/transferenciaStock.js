document.addEventListener("DOMContentLoaded", () => {
  // Configuramos el buscador
  document.getElementById("txtFilter").onkeyup = function (e) {
    filterTable(e.target.value, document.getElementById("tbdl"));
  };

  // Configuramos el botón de búsqueda
  document.getElementById("btnR").onclick = initLoad;

  // Abrir/Cerrar
  document.getElementById("closeDetalle").onclick = () => {
    document.getElementById("dl").style.display = "block";
    document.getElementById("dd").style.display = "none";
  };

  // Traemos los datos
  initLoad();
});

const controllerTS_A = "../../controllers/TransferenciaStockController.php";
const limit = 20;
var currentPage = 1;
var currentTS = null;

/**FUNCIONES PARA ADMINISTRATIVOS */
function initLoad() {  
  document.getElementById("divPag").innerHTML = "";
  currentPage = 1;
  const task = 1;
  const flag = 1;
  let fechaI = document.getElementById("txtFechaI").value;
  let fechaF = document.getElementById("txtFechaF").value;
  let search = document.getElementById("txtSearch").value.trim();
  $.post(
    controllerTS_A,
    {
      task,
      fechaI,
      fechaF,
      search,
      flag
    },
    function (response) {
      let totalItems = parseInt(response === 0 ? 1 : response);
      let totalPages = Math.ceil(totalItems / limit);

      // Carga inicial
      listar(fechaI, fechaF, search, 1, limit);

      // Configuramos la paginación
      if (totalPages > 1) {
        $("#divPag").simplePaginator({
          totalPages: totalPages,
          maxButtonsVisible: 5,
          currentPage: 1,
          nextLabel: ">>",
          prevLabel: "<<",
          firstLabel: "Primero",
          lastLabel: "Último",
          clickCurrentPage: true,
          pageChange: function (page) {
            listar(fechaI, fechaF, search, page, limit);
          },
        });
      } else {
        document.getElementById("divPag").innerHTML = "";
      }
    }
  );
}

function listar(fechaI, fechaF, search, page, limit) {
  const task = 2;
  const tbody = document.getElementById("tbdl");
  const button = document.getElementById("btnR");
  tbody.innerHTML = `<tr><td colspan="13"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

  $.post(
    controllerTS_A,
    {
      task,
      fechaI,
      fechaF,
      search,
      page,
      limit,
    },
    function (response) {
      const datos = JSON.parse(response);
      tbody.innerHTML = "";

      if (datos.length > 0) {
        datos.forEach((element) => {
          tbody.innerHTML += `<tr id="row${element.docentry}">
          <td class="text-primary" onclick="verDetalle(${element.docentry}, '${element.codigoSede}')">${element.docentry}</td>
          <td>${element.docnum}</td>
          <td>${element.almacenero}</td>
          <td>${element.solicitante}</td>
          <td>${element.guia}</td>
          <td>${element.solicitud}</td>
          <td>${element.fecha}</td>
          <td>${element.origen}</td>
          <td>${element.categoriaVehiculo}</td>
          <td>${element.modalidadTraslado}</td>
          <td>${element.transportista}</td>
          <td>${element.adjuntos}</td>
          <td id="tdDownload_${element.docentry}" onclick="layout(${element.docentry}, '${element.codigoSede}')"><i class="fa fa-download" aria-hidden="true" style="color: #4caf50;"></i></td>
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
  const task = 4;

  const tbody = document.getElementById("tbd");
  tbody.innerHTML = "";
  document.getElementById("dl").style.display = "none";
  document.getElementById("dd").style.display = "block";

  $.post(controllerTS_A, { task, docentry, sede }, function (response) {
    const datos = JSON.parse(response);
    document.getElementById("txtNumGuia").value = datos[0].guia;
    document.getElementById("txtNumDoc").value = datos[0].transferencia;
    document.getElementById("txtFechaDoc").value = datos[0].fecha;
    document.getElementById("txtTipo").value = datos[0].tipo;

    datos.forEach((element, index) => {
      tbody.innerHTML += `<tr>
        <td>${index + 1}</td>
        <td>${element.itemcode}</td>
        <td>${element.descripcion}</td>
        <td>${element.cantidad}</td>
      </tr>`;
    });
  });
}

function layout(docentry, sede) {
  document.getElementById(`tdDownload_${docentry}`).innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  const task = 4;

  $.post(controllerTS_A, { task, docentry, sede }, function (response) {
    const datos = JSON.parse(response);
    pdf(datos);
  });
}

function pdf(data) {
  let pdf = new jsPDF();

  pdf.setFontSize(14);
  pdf.setFontType("bold");
  pdf.text(`Nota de Transferencia N°${data[0].docnum}`, 105, 10, "center");

  // Cuadro cabecera
  pdf.setLineWidth(0.25);
  pdf.line(10, 20, 200, 20); // Arriba
  pdf.line(10, 38, 200, 38); // Abajo
  pdf.line(10, 20, 10, 38); // Izquierda
  pdf.line(200, 20, 200, 38); // Derecha

  // Información cabecera
  pdf.setFontSize(10);
  pdf.setFontType("normal");
  pdf.text(`Responsable: ${data[0].almacenero}`, 12, 25);
  pdf.text(`Fecha: ${data[0].fecha}`, 168, 25);
  pdf.text(`Área solicitante: ${data[0].solicitante}`, 12, 30);
  pdf.text(`Motivo de traslado: ${data[0].motivoTraslado}`, 12, 35);

  // Cabecera de tabla
  pdf.line(10, 40, 200, 40); // Arriba
  pdf.line(10, 47, 200, 47); // Abajo
  pdf.line(10, 40, 10, 47); // Izquierda
  pdf.line(200, 40, 200, 47); // Derecha
  pdf.text("Código", 12, 45);
  pdf.text("Descripción", 32, 45);
  pdf.text("Alm. Origen", 110, 45);
  pdf.text("Alm. Destino", 140, 45);
  pdf.text("UM", 170, 45);
  pdf.text("Cantidad", 183, 45);

  pdf.setFontSize(8);
  let height = 0;
  $.each(data, function (i) {
    pdf.text(data[i].itemcode, 12, 52 + i * 5);
    pdf.text(data[i].descripcion, 32, 52 + i * 5);
    pdf.text(data[i].almacenOrigen, 110, 52 + i * 5);
    pdf.text(data[i].almacenDestino, 140, 52 + i * 5);
    pdf.text(data[i].um, 170, 52 + i * 5);
    pdf.text(data[i].cantidad, 183, 52 + i * 5);
    height = 55 + i * 5;
  });

  pdf.line(10, height, 200, height); // Línea debajo de la tabla
  // Comentarios
  pdf.setFontSize(10);
  pdf.setFontType("bold");
  pdf.text("COMENTARIOS", 12, height + 5);
  pdf.setFontSize(10);
  pdf.setFontType("normal");
  pdf.text(data[0].comentarios ?? "", 12, height + 10);

  // Guardas el PDF
  pdf.save(`Nota de Transferencia N°${data[0].docnum}`);

  // Regresamos el botón a su estado inicial
  $(`#tdDownload_${data[0].docentry}`).html(
    '<i class="fa fa-download" aria-hidden="true" style="color: #4caf50;"></i>'
  );
}
