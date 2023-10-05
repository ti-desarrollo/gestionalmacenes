var tListaTransferencias_TransferenciaStockAdm = null;
var tDetalle_TransferenciaStockAdm = null;
var tListaTransferencias_TransferenciaStock = null;
var tDetalle_TransferenciaStock = null;

function listarTransferenciasAdm() {
  if (tListaTransferencias_TransferenciaStockAdm) {
    tListaTransferencias_TransferenciaStockAdm.destroy();
  }
  let table = $("#tListaTransferencias_TransferenciaStockAdm");
  let tbody = $("#tbodyTransferencias_TransferenciaStockAdm");
  tbody.empty();
  $("#btnReportar_TransferenciaStockAdm").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_TransferenciaStockAdm").show();
  $("#divDetalle_TransferenciaStockAdm").hide();

  $.post(
    "../../controllers/TransferenciaStockController.php",
    {
      task: 4,
      fechaI: $("#txtFechaInicio_TransferenciaStockAdm").val(),
      fechaF: $("#txtFechaFin_TransferenciaStockAdm").val(),
    },
    function (response) {
      $("#btnReportar_TransferenciaStockAdm").html(
        '<i class="fa fa-play"></i> REPORTAR'
      );
      let datos = JSON.parse(response);

      $.each(datos, function (i) {
        tbody.append(
          `<tr>
            <td class="text-primary" onclick="listarDetalleTransferenciaAdm(${datos[i].docentry}, '${datos[i].codigoSede}')">${datos[i].docentry}</td>
            <td>${datos[i].almacenero}</td>
            <td>${datos[i].solicitante}</td>
            <td>${datos[i].guia}</td>
            <td>${datos[i].fecha}</td>
            <td>${datos[i].origen}</td>
            <td>${datos[i].categoriaVehiculo}</td>
            <td>${datos[i].modalidadTraslado}</td>
            <td>${datos[i].transportista}</td>
            <td id="files_${datos[i].solicitud}"></td>
            <td id="tdDownload_${datos[i].docentry}" onclick="layoutTransferencia(${datos[i].docentry}, '${datos[i].codigoSede}')"><i class="fa fa-download" aria-hidden="true" style="color: #4caf50;"></i></td>
            </tr>`
        );
        $.post(
          "../../controllers/TransferenciaStockController.php",
          {
            task: 3,
            solicitud: datos[i].solicitud,
          },
          function (response) {
            let adjuntos = JSON.parse(response);
            $.each(adjuntos, function (a) {
              $(`#files_${datos[i].solicitud}`).append(
                `<p style="margin: unset;"><a class="text-primary" href="../../docs/solicitudTraslado/${adjuntos[a].ds_documento}" target="_blank">${adjuntos[a].ds_documento}</a></p>`
              );
            });
          }
        );
      });

      tListaTransferencias_TransferenciaStockAdm = table.DataTable({
        dom: "Bftlp",
        buttons: ["excelHtml5", "pdfHtml5"],
        scrollCollapse: true,
        paging: false,
        language: {
          lengthMenu: "Ver _MENU_ registros por página",
          zeroRecords: "No se encontraron resultados",
          info: "Página _PAGE_ of _PAGES_",
          search: "Buscar solicitud: ",
          infoEmpty: "No hay registros disponibles",
          infoFiltered: "(filtered from _MAX_ total records)",
        },
      });
    }
  );
}

function listarDetalleTransferenciaAdm(docentry, sede) {
  if (tDetalle_TransferenciaStockAdm) {
    tDetalle_TransferenciaStockAdm.destroy();
  }
  let table = $("#tDetalle_TransferenciaStockAdm");
  let tbody = $("#tbodyDetalle_TransferenciaStockAdm");
  tbody.empty();
  $("#divLista_TransferenciaStockAdm").hide();
  $("#divDetalle_TransferenciaStockAdm").show();

  $.post(
    "../../controllers/TransferenciaStockController.php",
    { task: 2, docentry, sede },
    function (response) {
      let datos = JSON.parse(response);

      if (datos.length > 0) {
        $("#txtNumGuia_TransferenciaStockAdm").val(datos[0].guia);
        $("#txtNumDoc_TransferenciaStockAdm").val(datos[0].docnum);
        $("#txtFechaDoc_TransferenciaStockAdm").val(datos[0].fecha);
        $("#txtTipo_TransferenciaStockAdm").val(datos[0].tipo);

        $.each(datos, function (i) {
          tbody.append(
            ` <tr>
                <td>${i + 1}</td>
                <td>${datos[i].itemcode}</td>
                <td>${datos[i].descripcion}</td>
                <td>${datos[i].cantidad}</td>
              </tr>`
          );
        });

        tDetalle_TransferenciaStockAdm = table.DataTable({
          dom: "Bftlp",
          buttons: ["excelHtml5", "pdfHtml5"],
          scrollCollapse: true,
          paging: false,
          language: {
            lengthMenu: "Ver _MENU_ registros por página",
            zeroRecords: "No se encontraron resultados",
            info: "Página _PAGE_ of _PAGES_",
            search: "Buscar solicitud: ",
            infoEmpty: "No hay registros disponibles",
            infoFiltered: "(filtered from _MAX_ total records)",
          },
        });
      }
    }
  );
}

function listarTransferencias() {
  if (tListaTransferencias_TransferenciaStock) {
    tListaTransferencias_TransferenciaStock.destroy();
  }
  let table = $("#tListaTransferencias_TransferenciaStock");
  let tbody = $("#tbodyTransferencias_TransferenciaStock");
  tbody.empty();
  $("#btnReportar_TransferenciaStock").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_TransferenciaStock").show();
  $("#divDetalle_TransferenciaStock").hide();

  $.post(
    "../../controllers/TransferenciaStockController.php",
    {
      task: 1,
      fechaI: $("#txtFechaInicio_TransferenciaStock").val(),
      fechaF: $("#txtFechaFin_TransferenciaStock").val(),
    },
    function (response) {
      $("#btnReportar_TransferenciaStock").html(
        '<i class="fa fa-play"></i> REPORTAR'
      );
      let datos = JSON.parse(response);

      $.each(datos, function (i) {
        tbody.append(
          `<tr>
            <td class="text-primary" onclick="listarDetalleTransferencia(${datos[i].docentry})">${datos[i].docentry}</td>
            <td>${datos[i].guia}</td>
            <td>${datos[i].fecha}</td>
            <td>${datos[i].origen}</td>
            <td>${datos[i].categoriaVehiculo}</td>
            <td>${datos[i].modalidadTraslado}</td>
            <td>${datos[i].transportista}</td>
            <td id="files_${datos[i].docentry}"></td>
            <td id="tdDownload_${datos[i].docentry}" onclick='layoutTransferencia(${datos[i].docentry})'><i class="fa fa-download" aria-hidden="true" style="color: #4caf50;"></i></td>
            </tr>`
        );
        $.post(
          "../../controllers/TransferenciaStockController.php",
          {
            task: 3,
            solicitud: datos[i].solicitud,
          },
          function (response) {
            let adjuntos = JSON.parse(response);
            $.each(adjuntos, function (a) {
              $(`#files_${datos[i].docentry}`).append(
                `<p style="margin: unset;"><a class="text-primary" href="../../docs/solicitudTraslado/${adjuntos[a].ds_documento}" target="_blank">${adjuntos[a].ds_documento}</a></p>`
              );
            });
          }
        );
      });

      tListaTransferencias_TransferenciaStock = table.DataTable({
        dom: "Bftlp",
        buttons: ["excelHtml5", "pdfHtml5"],
        scrollCollapse: true,
        paging: false,
        language: {
          lengthMenu: "Ver _MENU_ registros por página",
          zeroRecords: "No se encontraron resultados",
          info: "Página _PAGE_ of _PAGES_",
          search: "Buscar solicitud: ",
          infoEmpty: "No hay registros disponibles",
          infoFiltered: "(filtered from _MAX_ total records)",
        },
      });
    }
  );
}

function listarDetalleTransferencia(docentry) {
  if (tDetalle_TransferenciaStock) {
    tDetalle_TransferenciaStock.destroy();
  }
  let table = $("#tDetalle_TransferenciaStock");
  let tbody = $("#tbodyDetalle_TransferenciaStock");
  tbody.empty();
  $("#divLista_TransferenciaStock").hide();
  $("#divDetalle_TransferenciaStock").show();

  $.post(
    "../../controllers/TransferenciaStockController.php",
    { task: 2, docentry },
    function (response) {
      let datos = JSON.parse(response);

      if (datos.length > 0) {
        $("#txtNumGuia_TransferenciaStock").val(datos[0].guia);
        $("#txtNumDoc_TransferenciaStock").val(datos[0].docnum);
        $("#txtFechaDoc_TransferenciaStock").val(datos[0].fecha);
        $("#txtTipo_TransferenciaStock").val(datos[0].tipo);
        $("#btnLayout_TransferenciaStock").html(
          `<button type="button" class="btn btn-primary btn-sm" onclick="layoutTransferencia(${docentry});"><i class="fa fa-fw fa-eye"></i> Layout</button>`
        );

        $.each(datos, function (i) {
          tbody.append(
            ` <tr>
                <td>${i + 1}</td>
                <td>${datos[i].itemcode}</td>
                <td>${datos[i].descripcion}</td>
                <td>${datos[i].cantidad}</td>
              </tr>`
          );
        });

        tDetalle_TransferenciaStock = table.DataTable({
          dom: "Bftlp",
          buttons: ["excelHtml5", "pdfHtml5"],
          scrollCollapse: true,
          paging: false,
          language: {
            lengthMenu: "Ver _MENU_ registros por página",
            zeroRecords: "No se encontraron resultados",
            info: "Página _PAGE_ of _PAGES_",
            search: "Buscar solicitud: ",
            infoEmpty: "No hay registros disponibles",
            infoFiltered: "(filtered from _MAX_ total records)",
          },
        });
      }
    }
  );
}

function layoutTransferencia(docentry, sede) {
  $(`#tdDownload_${docentry}`).html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );

  $.post(
    "../../controllers/TransferenciaStockController.php",
    { task: 2, docentry, sede },
    function (response) {
      let datos = JSON.parse(response);
      pdfTransferencia(datos);
    }
  );
}

function pdfTransferencia(data) {
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
