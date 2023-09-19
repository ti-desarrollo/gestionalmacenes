function listarTransferencias() {
  $("#btnReportar_TransferenciaStock").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_TransferenciaStock").show();
  $("#divDetalle_TransferenciaStock").hide();

  $.get(
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
      let table = $("#tListaTransferencias_TransferenciaStock");
      let tbody = $("#tbodyTransferencias_TransferenciaStock");
      tbody.empty();

      $.each(datos, function (i) {
        tbody.append(
          `<tr>
            <td class="text-primary" onclick="listarDetalleTransferencia(${datos[i].docentry})">${datos[i].docentry}</td>
            <td>${datos[i].guia}</td>
            <td>${datos[i].fecha}</td>
            <td>${datos[i].tipo}</td>
            <td>${datos[i].origen}</td>
            <td>${datos[i].transportista}</td>
            <td>${datos[i].placa}</td>
            <td></td>
            <td id="files_${datos[i].docentry}"></td>
            </tr>`
        );
        $.get(
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

      if (!$.fn.DataTable.isDataTable(table)) {
        table.DataTable({
          dom: "Bfrtp",
          buttons: ["excel"],
          pageLength: 25,
          order: [[0, "DESC"]],
          language: { url: "../../libs/datatables/dt_spanish.json" },
        });
      }
    }
  );
}

function listarDetalleTransferencia(docentry) {
  $("#divLista_TransferenciaStock").hide();
  $("#divDetalle_TransferenciaStock").show();

  $.get(
    "../../controllers/TransferenciaStockController.php",
    { task: 2, docentry: docentry },
    function (response) {
      let datos = JSON.parse(response);
      let table = $("#tDetalle_TransferenciaStock");
      let tbody = $("#tbodyDetalle_TransferenciaStock");
      tbody.empty();

      if (datos.length > 0) {
        $("#txtNumGuia_TransferenciaStock").val(datos[0].guia);
        $("#txtNumDoc_TransferenciaStock").val(datos[0].docnum);
        $("#txtFechaDoc_TransferenciaStock").val(datos[0].fecha);
        $("#txtTipo_TransferenciaStock").val(datos[0].tipo);
        $("#btnLayout_TransferenciaStock").html(
          `<button type="button" class="btn btn-primary" onclick="layoutTransferencia(${docentry});"><i class="fa fa-fw fa-eye"></i> Layout</button>`
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

        if (!$.fn.DataTable.isDataTable(table)) {
          table.DataTable({
            dom: "Bfrtp",
            buttons: ["excel"],
            pageLength: 25,
            order: [[0, "DESC"]],
            language: { url: "../../libs/datatables/dt_spanish.json" },
          });
        }
      }
    }
  );
}

function layoutTransferencia(docentry) {
  let divLayout = $("#layout_TransferenciaStock");
  $.get(
    "../../controllers/TransferenciaStockController.php",
    { task: 2, docentry: docentry },
    function (response) {
      let datos = JSON.parse(response);
      divLayout.html(`
        <h3 style="text-align: center;">Nota de Transferencia N° ${datos[0].docnum}</h3>
        <div>
            <div class="row" style="border: 1px solid; border-radius: 10px;">
                <div class="col-sm-9"><p><b>Responsable: </b> ${datos[0].almacenero}</p></div>
                <div class="col-sm-3"><p><b>Fecha: </b>${datos[0].fecha}</p></div>
                <div class="col-sm-12"><p><b>Área solicitante: </b>${datos[0].solicitante}</p></div>
                <div class="col-sm-12"><p><b>Motivo de traslado:</b> ${datos[0].motivoTraslado}</p></div>
            </div>
        </div>
        <hr style="border: 1px solid;" />
        <table class="table table-bordered">
            <thead>
                <th>Código</th>
                <th>Descripción</th>
                <th>Almacen origen</th>
                <th>Almacen destino</th>
                <th>UM</th>
                <th>Cantidad</th>
            </thead>
            <tbody id="tablaLayout"></tbody>
        </table>
        <hr style="border: 1px solid;" />
        <p><b>COMENTARIOS</b></p>
        <p>${datos[0].comentarios ?? ""}</p>
        <button type="button" class="btn btn-primary" onclick='pdfTransferencia(${JSON.stringify(datos)});'><i class="fa fa-fw fa-print"></i> Descargar PDF</button>`);

      let tablaLayout = $("#tablaLayout");
      $.each(datos, function (i) {
        tablaLayout.append(
          `<tr>
                <td>${datos[i].itemcode}</td>
                <td>${datos[i].descripcion}</td>
                <td>${datos[i].almacenOrigen}</td>
                <td>${datos[i].almacenDestino}</td>
                <td>${datos[i].um}</td>
                <td>${datos[i].cantidad}</td>
            </tr>`
        );
      });
    }
  );
  $("#mdlLayout_TransferenciaStock").modal("toggle");
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

  pdf.save(`Nota de Transferencia N°${data[0].docnum}`);
}
