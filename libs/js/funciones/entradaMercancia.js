function listarEntradaMercancias() {
  $("#btnReportar_EntradaMercancia").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_EntradaMercancia").show();
  $("#divDetalle_EntradaMercancia").hide();

  $.get(
    "../../controllers/EntradaMercanciaController.php",
    {
      task: 1,
      fechaI: $("#txtFechaInicio_EntradaMercancia").val(),
      fechaF: $("#txtFechaFin_EntradaMercancia").val(),
    },
    function (response) {
      $("#btnReportar_EntradaMercancia").html(
        '<i class="fa fa-play"></i> REPORTAR'
      );
      let datos = JSON.parse(response);
      let table = $("#tListaEntradas_EntradaMercancia");
      let tbody = $("#tbodyDetalleEntradas_EntradaMercancia");
      tbody.empty();
      console.log(datos);

      $.each(datos, function (i) {
        tbody.append(
          `
            <tr>
                <td>${datos[i].pedido}</td>
                <td>${datos[i].entrada}</td>
                <td>${datos[i].proveedor}</td>
                <td>${datos[i].fechaRecepcion}</td>
                <td>${datos[i].guia}</td>
                <td class="text-primary" onclick="listarEntradaMercanciasDeta(${datos[i].docentryEntrada})">${datos[i].docentryEntrada}</td>
                <td id="files${datos[i].docentryEntrada}"></td>
            </tr>
            `
        );
        $.get(
          "../../controllers/EntradaMercanciaController.php",
          {
            task: 3,
            pedido: datos[i].docentryPedido,
            guia: datos[i].guia,
          },
          function (response) {
            let files = JSON.parse(response);
            $.each(files, function (a) {
              $(`#files${datos[i].docentryEntrada}`).append(
                `<p style="margin: unset;"><a href="https://gestionalmacenes.3aamseq.com.pe/docs/pedidos/${files[a].carpeta}/RECEPCIÓN%20DE%20MERCADERÍA%20-%20ALMACÉN/${files[a].year}/${files[a].mes}/COMPRAS NACIONALES/${files[a].proveedor}/${files[a].fechaFormato}/${files[a].fileName}" target="_blank">${files[a].fileName}</a></p>`
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

function listarEntradaMercanciasDeta(docentry) {
  $("#divLista_EntradaMercancia").hide();
  $("#divDetalle_EntradaMercancia").show();

  $.get(
    "../../controllers/EntradaMercanciaController.php",
    { task: 2, docentry: docentry },
    function (response) {
      let datos = JSON.parse(response);
      let table = $("#tDetalle_EntradaMercancia");
      let tbody = $("#tbodyDetalle_EntradaMercancia");
      tbody.empty();

      if (datos.length > 0) {
        $("#txtNumGuia_EntradaMercancia").val(datos[0].guia);
        $("#txtNumDoc_EntradaMercancia").val(datos[0].entrada);
        $("#txtFechaDoc_EntradaMercancia").val(datos[0].fechaRecepcion);
        $("#txtTipo_EntradaMercancia").val(datos[0].tipo);

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
            language: { url: "../../libs/datatables/dt_spanish.json" },
          });
        }
      }
    }
  );
}
