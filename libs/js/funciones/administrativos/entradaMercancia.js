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
const controllerEM_A = "../../controllers/EntradaMercanciaController.php";
const limit = 20;
var currentPage = 1;

/**FUNCIONES PARA ADMINISTRATIVOS */
function initLoad() {  
  currentPage = 1;
  const task = 1;
  const flag = 1;
  let fechaI = document.getElementById("txtFechaI").value;
  let fechaF = document.getElementById("txtFechaF").value;
  let search = document.getElementById("txtSearch").value.trim();
  $.post(
    controllerEM_A,
    {
      task,
      fechaI,
      fechaF,
      search,
      flag,
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
    controllerEM_A,
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
                <td class="text-primary" onclick="verDetalle(${element.docentryEntrada}, '${element.codigoSede}')">${element.docentryEntrada}</td>
                <td>${element.sede}</td>
                <td>${element.usuario}</td>
                <td>${element.pedido}</td>
                <td>${element.rucTransportista}</td>
                <td>${element.rzTransportista}</td>
                <td>${element.formaEnvio}</td>
                <td>${element.entrada}</td>
                <td>${element.proveedor}</td>
                <td>${element.fechaRecepcion}</td>
                <td>${element.guia}</td>
                <td>${element.adjuntos}</td>
                <td id="tdDownload_${element.docentryEntrada}" onclick='layout(${element.docentryEntrada})'><i class="fa fa-download" aria-hidden="true" style="color: #4caf50;"></i></td>
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

function verDetalle(docentry, sede) {
  /**Agregar clase para saber que fila fue la que abrimos */
  rowSelected(docentry);
  const task = 4;
  const tbody = document.getElementById("tbd");
  tbody.innerHTML = "";
  document.getElementById("dl").style.display = "none";
  document.getElementById("dd").style.display = "block";

  $.post(controllerEM_A, { task, docentry, sede }, function (response) {
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
  });
}

function layout(docentry) {
  document.getElementById(`tdDownload_${docentry}`).innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  const task = 5;
  $.post(controllerEM_A, { task, docentry }, function (response) {
    const datos = JSON.parse(response);
    pdf(datos);
  });
}

function pdf(data) {
  let pdf = new jsPDF();

  // Logo
  pdf.setFontSize(12);
  pdf.setFontType("bold");
  pdf.text("3AAMSEQ S.A", 180, 10, "right");

  // Titulo
  pdf.setFontSize(12);
  pdf.setFontType("bold");
  pdf.text(
    `NOTA DE RECEPCIÓN DE MERCADERÍA N° ${data[0].DocNum}`,
    105,
    20,
    "center"
  );

  // Información leyenda
  // Derecha
  pdf.setFontSize(10);
  pdf.setFontType("bold");
  // Primera línea
  pdf.text("Empresa:", 10, 35);
  pdf.text("RUC:", 100, 35);
  // Segunda línea
  pdf.text("Creado por:", 10, 40);
  pdf.text("Fecha de recepción:", 100, 40);
  pdf.text("N° Pedido:", 160, 40);
  // Tercera línea
  pdf.text("Almacén entrada:", 10, 45);
  pdf.text("Fecha de registro:", 100, 45);
  pdf.text("Guía:", 160, 45);

  // Información datos
  // Primera línea
  pdf.setFontSize(9);
  pdf.setFontType("normal");
  pdf.text(data[0].NOM_CLIENTE, 27, 35);
  pdf.text(data[0]["RUC/DNI"], 110, 35);
  // Segunda línea
  pdf.text(data[0].Usuario, 31, 40);
  pdf.text(data[0].fechaRecepcion, 135, 40);
  pdf.text(`${data[0].docnumPedido}`, 179, 40);
  // Tercera línea
  pdf.text(data[0]["sede entrada"], 41, 45);
  pdf.text(data[0].fechaRegistro, 132, 45);
  pdf.text(
    `${data[0].TipoDoc}-${data[0].SerieDoc}-${data[0].CorreDoc}`,
    170,
    45
  );

  // Cabecera de tabla
  pdf.setFontSize(10);
  pdf.setFontType("bold");
  pdf.text("NRO", 10, 60);
  pdf.text("CÓDIGO", 20, 60);
  pdf.text("DESCRIPCIÓN", 40, 60);
  pdf.text("UM", 170, 60);
  pdf.text("CANTIDAD", 180, 60);

  pdf.setFontSize(10);
  pdf.setFontType("normal");
  let height = 0;
  $.each(data, function (i) {
    pdf.text(`${i + 1}`, 10, 65 + i * 5);
    pdf.text(data[i].Codigo, 20, 65 + i * 5);
    pdf.text(data[i].DESC_ART, 40, 65 + i * 5);
    pdf.text(data[i].UNID_MEDIDA, 170, 65 + i * 5);
    pdf.text(Number.parseFloat(data[i].CANTIDAD).toFixed(2), 180, 65 + i * 5);
    height = 65 + i * 5;
  });

  // Guardar PDF
  pdf.save(`Entrada de mercancías - N°${data[0].DocNum}`);

  // Regresamos el botón a su estado inicial
  $(`#tdDownload_${data[0].DocEntry}`).html(
    '<i class="fa fa-download" aria-hidden="true" style="color: #4caf50;"></i>'
  );
}
