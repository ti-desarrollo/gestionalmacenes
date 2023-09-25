var tListaEntradas_EntradaMercanciaAdm = null;
var tDetalle_EntradaMercanciaAdm = null;
var tListaEntradas_EntradaMercancia = null;
var tDetalle_EntradaMercancia = null;

function listarEntradaMercanciasAdm() {
  if (tListaEntradas_EntradaMercanciaAdm) {
    tListaEntradas_EntradaMercanciaAdm.destroy();
  }
  let table = $("#tListaEntradas_EntradaMercanciaAdm");
  let tbody = $("#tbodyDetalleEntradas_EntradaMercanciaAdm");
  tbody.empty();
  $("#btnReportar_EntradaMercanciaAdm").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_EntradaMercanciaAdm").show();
  $("#divDetalle_EntradaMercanciaAdm").hide();

  $.post(
    "../../controllers/EntradaMercanciaController.php",
    {
      task: 5,
      fechaI: $("#txtFechaInicio_EntradaMercanciaAdm").val(),
      fechaF: $("#txtFechaFin_EntradaMercanciaAdm").val(),
    },
    function (response) {
      $("#btnReportar_EntradaMercanciaAdm").html(
        '<i class="fa fa-play"></i> REPORTAR'
      );
      let datos = JSON.parse(response);

      $.each(datos, function (i) {
        tbody.append(
          `
            <tr>
                <td>${datos[i].sede}</td>
                <td>${datos[i].usuario}</td>
                <td>${datos[i].pedido}</td>
                <td>${datos[i].entrada}</td>
                <td>${datos[i].proveedor}</td>
                <td>${datos[i].fechaRecepcion}</td>
                <td>${datos[i].guia}</td>
                <td class="text-primary" onclick="listarEntradaMercanciasDetaAdm(${datos[i].docentryEntrada}, '${datos[i].codigoSede}')">${datos[i].docentryEntrada}</td>
                <td id="files${datos[i].docentryEntrada}"></td>
                <td id="tdDownload_${datos[i].docentryEntrada}" onclick='layoutEntradaMercancia(${datos[i].docentryEntrada})'><i class="fa fa-download" aria-hidden="true" style="color: #4caf50;"></i></td>
            </tr>
            `
        );
        $.post(
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

      tListaEntradas_EntradaMercanciaAdm = table.DataTable({
        dom: "Bftlp",
        buttons: ["excelHtml5", "pdfHtml5"],
        scrollCollapse: true,
        paging: true,
        language: {
          lengthMenu: "Ver _MENU_ registros por página",
          zeroRecords: "No se encontraron resultados",
          info: "Página _PAGE_ of _PAGES_",
          search: "Buscar pedido: ",
          infoEmpty: "No hay registros disponibles",
          infoFiltered: "(filtered from _MAX_ total records)",
        },
      });
    }
  );
}

function listarEntradaMercanciasDetaAdm(docentry, sede) {
  if (tDetalle_EntradaMercanciaAdm) {
    tDetalle_EntradaMercanciaAdm.destroy();
  }
  let table = $("#tDetalle_EntradaMercanciaAdm");
  let tbody = $("#tbodyDetalle_EntradaMercanciaAdm");
  tbody.empty();
  $("#divLista_EntradaMercanciaAdm").hide();
  $("#divDetalle_EntradaMercanciaAdm").show();

  $.post(
    "../../controllers/EntradaMercanciaController.php",
    { task: 2, docentry, sede },
    function (response) {
      let datos = JSON.parse(response);

      if (datos.length > 0) {
        $("#txtNumGuia_EntradaMercanciaAdm").val(datos[0].guia);
        $("#txtNumDoc_EntradaMercanciaAdm").val(datos[0].entrada);
        $("#txtFechaDoc_EntradaMercanciaAdm").val(datos[0].fechaRecepcion);
        $("#txtTipo_EntradaMercanciaAdm").val(datos[0].tipo);

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

        tDetalle_EntradaMercanciaAdm = table.DataTable({
          dom: "Bftlp",
          buttons: ["excelHtml5", "pdfHtml5"],
          scrollCollapse: true,
          paging: true,
          language: {
            lengthMenu: "Ver _MENU_ registros por página",
            zeroRecords: "No se encontraron resultados",
            info: "Página _PAGE_ of _PAGES_",
            search: "Buscar pedido: ",
            infoEmpty: "No hay registros disponibles",
            infoFiltered: "(filtered from _MAX_ total records)",
          },
        });
      }
    }
  );
}

function listarEntradaMercancias() {
  if (tListaEntradas_EntradaMercancia) {
    tListaEntradas_EntradaMercancia.destroy();
  }
  let table = $("#tListaEntradas_EntradaMercancia");
  let tbody = $("#tbodyDetalleEntradas_EntradaMercancia");
  tbody.empty();
  $("#btnReportar_EntradaMercancia").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_EntradaMercancia").show();
  $("#divDetalle_EntradaMercancia").hide();

  $.post(
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
                <td id="tdDownload_${datos[i].docentryEntrada}" onclick='layoutEntradaMercancia(${datos[i].docentryEntrada})'><i class="fa fa-download" aria-hidden="true" style="color: #4caf50;"></i></td>
            </tr>
            `
        );
        $.post(
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

      tListaEntradas_EntradaMercancia = table.DataTable({
        dom: "Bftlp",
        buttons: ["excelHtml5", "pdfHtml5"],
        scrollCollapse: true,
        paging: true,
        language: {
          lengthMenu: "Ver _MENU_ registros por página",
          zeroRecords: "No se encontraron resultados",
          info: "Página _PAGE_ of _PAGES_",
          search: "Buscar pedido: ",
          infoEmpty: "No hay registros disponibles",
          infoFiltered: "(filtered from _MAX_ total records)",
        },
      });
    }
  );
}

function listarEntradaMercanciasDeta(docentry) {
  if (tDetalle_EntradaMercancia) {
    tDetalle_EntradaMercancia.destroy();
  }
  let table = $("#tDetalle_EntradaMercancia");
  let tbody = $("#tbodyDetalle_EntradaMercancia");
  tbody.empty();
  $("#divLista_EntradaMercancia").hide();
  $("#divDetalle_EntradaMercancia").show();

  $.post(
    "../../controllers/EntradaMercanciaController.php",
    { task: 2, docentry },
    function (response) {
      let datos = JSON.parse(response);

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

        tDetalle_EntradaMercancia = table.DataTable({
          dom: "Bftlp",
          buttons: ["excelHtml5", "pdfHtml5"],
          scrollCollapse: true,
          paging: true,
          language: {
            lengthMenu: "Ver _MENU_ registros por página",
            zeroRecords: "No se encontraron resultados",
            info: "Página _PAGE_ of _PAGES_",
            search: "Buscar pedido: ",
            infoEmpty: "No hay registros disponibles",
            infoFiltered: "(filtered from _MAX_ total records)",
          },
        });
      }
    }
  );
}

function layoutEntradaMercancia(docentry) {
  $(`#tdDownload_${docentry}`).html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );

  $.post(
    "../../controllers/EntradaMercanciaController.php",
    { task: 4, docentry },
    function (response) {
      let datos = JSON.parse(response);
      pdfEntradaMercancia(datos);
    }
  );
}

function pdfEntradaMercancia(data) {
  let pdf = new jsPDF();

  // Logo
  pdf.setFontSize(12);
  pdf.setFontType("bold");
  pdf.text("3AAMSEQ S.A", 180, 10, "right");

  // Titulo
  pdf.setFontSize(12);
  pdf.setFontType("bold");
  pdf.text(
    `NOTA DE REPECIÓN DE MERCADERÍA N° ${data[0].DocNum}`,
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
