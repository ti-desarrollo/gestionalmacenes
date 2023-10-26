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
    document.getElementById("txtNumGuia").value = "";
    document.getElementById("txtNumDoc").value = "";
    document.getElementById("txtFechaDoc").value = "";
    document.getElementById("txtTipo").value = "";
  };

  // Traemos los datos
  initLoad();
});

const limit = 20;
var currentPage = 1;
var load = true;
var currentEM = null;
var tListaEntradas_EntradaMercancia = null;
var tDetalle_EntradaMercancia = null;

/** FUNCIONES PARA ADMINISTRATIVOS */
function initLoad() {
  currentPage = 1;
  const task = 1;
  let fechaI = document.getElementById("txtFechaI").value;
  let fechaF = document.getElementById("txtFechaF").value;
  let search = document.getElementById("txtSearch").value;
  $.post(
    "../../controllers/EntradaMercanciaController.php",
    {
      task,
      fechaI,
      fechaF,
      search,
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
  load = true;

  const tbody = document.getElementById("tbdl");
  const button = document.getElementById("btnR");
  tbody.innerHTML = `<tr><td colspan="13"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

  const task = 3;
  $.post(
    "../../controllers/EntradaMercanciaController.php",
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
          tbody.innerHTML += `
            <tr id="row${element.docentryEntrada}">
                <td>${element.pedido}</td>
                <td>${element.entrada}</td>
                <td>${element.proveedor}</td>
                <td>${element.fechaRecepcion}</td>
                <td>${element.guia}</td>
                <td class="text-primary" onclick="verDetalle(${element.docentryEntrada})">${element.docentryEntrada}</td>
                <td>${element.adjuntos}</td>
                <td id="tdDownload_${element.docentryEntrada}" onclick='layoutEntradaMercancia(${element.docentryEntrada})'><i class="fa fa-download" aria-hidden="true" style="color: #4caf50;"></i></td>
            </tr>
            `;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="13">Sin resultados</td></tr>`;
      }

      button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
      load = false;
    }
  );
}

function verDetalle(docentry) {
  currentEM = docentry;
  /**Agregar clase para saber que fila fue la que abrimos */
  const tbdl = document.getElementById("tbdl");
  var rows = tbdl.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const idRow = row.getAttribute("id");
    const shouldAddClass = idRow === `row${currentEM}`;
    row.classList.toggle("blob", shouldAddClass);
  }

  const tbody = document.getElementById("tbd");
  tbody.innerHTML = "";
  document.getElementById("dl").style.display = "none";
  document.getElementById("dd").style.display = "block";
  const task = 4;
  $.post(
    "../../controllers/EntradaMercanciaController.php",
    { task, docentry },
    function (response) {
      const datos = JSON.parse(response);
      document.getElementById("txtNumGuia").value = datos[0].guia;
      document.getElementById("txtNumDoc").value = datos[0].entrada;
      document.getElementById("txtFechaDoc").value = datos[0].fechaRecepcion;
      document.getElementById("txtTipo").value = datos[0].tipo;

      datos.forEach((element, index) => {
        tbody.innerHTML += `<tr>
        <td>${index + 1}</td>
        <td>${element.itemcode}</td>
        <td>${element.descripcion}</td>
        <td>${element.cantidad}</td>
      </tr>`;
      });
    }
  );
}
