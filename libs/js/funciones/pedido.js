var tListaPedidos_PedidoAdm = null;
var tDetalle_PedidoAdm = null;
var tListaPedidos_Pedido = null;
var tDetalle_Pedido = null;

function listarPedidosAdm() {
  if (tListaPedidos_PedidoAdm) {
    tListaPedidos_PedidoAdm.destroy();
  }
  let table = $("#tListaPedidos_PedidoAdm");
  let tbody = $("#tbodyPedidos_PedidoAdm");
  tbody.empty();
  $("#btnReportar_PedidoAdm").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_PedidoAdm").show();
  $("#divDetalle_PedidoAdm").hide();
  $.post(
    "../../controllers/PedidoController.php",
    {
      task: 7,
      fechaI: $("#txtFechaInicio_PedidoAdm").val(),
      fechaF: $("#txtFechaFin_PedidoAdm").val(),
    },
    function (response) {
      $("#btnReportar_PedidoAdm").html('<i class="fa fa-play"></i> REPORTAR');
      let datos = JSON.parse(response);

      $.each(datos, function (i) {
        tbody.append(`
          <tr>
              <td class="text-primary" onclick="listarDetallePedidoAdm(${datos[i].codigo
          }, '${datos[i].sedeCodigo}')">${datos[i].codigo}</td>
              <td>${datos[i].estado}</td>
              <td>${datos[i].conformidad}</td>
              <td>${datos[i].usuario}</td>
              <td>${datos[i].pedido}</td>
              <td>${datos[i].guia}</td>
              <td>${datos[i].proveedor}</td>
              <td>${datos[i].fechaEntrega}</td>
              <td>${datos[i].fechaRecepcion}</td>
              <td>${datos[i].sede}</td>       
              <td>${datos[i].documentos.map((doc) => {
            return `<a href="https://gestionalmacenes.3aamseq.com.pe/docs/pedidos/${datos[i].carpeta}/RECEPCIÓN%20DE%20MERCADERÍA%20-%20ALMACÉN/${datos[i].year}/${datos[i].mes}/COMPRAS NACIONALES/${datos[i].proveedor}/${datos[i].fechaFormato}/${doc.dp_documento}" target="_blank">${doc.dp_documento}</a>`;
          })}</td>             
          </tr>
      `);
      });

      tListaPedidos_PedidoAdm = table.DataTable({
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

function listarDetallePedidoAdm(docentry, sede) {
  if (tDetalle_PedidoAdm) {
    tDetalle_PedidoAdm.destroy();
  }
  let table = $("#tDetalle_PedidoAdm");
  let tbody = $("#tbodyDetalle_PedidoAdm");
  tbody.empty();
  $("#divLista_PedidoAdm").hide();
  $("#divDetalle_PedidoAdm").show();

  $.post(
    "../../controllers/PedidoController.php",
    { task: 2, docentry, sede },
    function (response) {
      let datos = JSON.parse(response);

      if (datos.length > 0) {
        $("#txtGuia_PedidoAdm").val(datos[0].guia);
        $("#txtNumDoc_PedidoAdm").val(datos[0].documento);
        $("#txtFechaDoc_PedidoAdm").val(datos[0].fecha);
        $("#txtEstado_PedidoAdm").val(datos[0].estado);
        $("#txtConformidad_PedidoAdm").val(datos[0].conformidad);
        $("#txtComentario_PedidoAdm").val(datos[0].observacion);

        $.each(datos, function (i) {
          tbody.append(
            `
            <tr>
                <td style="vertical-align: middle">${i + 1}</td>
                <td style="vertical-align: middle">${datos[i].item}</td>
                <td style="vertical-align: middle">${datos[i].descripcion}</td>
                <td style="vertical-align: middle">${datos[i].um}</td>
                <td style="vertical-align: middle">${datos[i].cantidadPedida
            }</td>
                <td style="vertical-align: middle">${datos[i].cantidadRecibida
            }</td>
                <td style="vertical-align: middle">${datos[i].cantidadRecepcionada
            }</td>
            </tr>
            `
          );
        });

        tDetalle_PedidoAdm = table.DataTable({
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

function listarPedidos() {
  if (tListaPedidos_Pedido) {
    tListaPedidos_Pedido.destroy();
  }
  let table = $("#tListaPedidos_Pedido");
  let tbody = $("#tbodyListaPedidos_Pedido");
  tbody.empty();
  $("#btnReportar_Pedido").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_Pedido").show();
  $("#divDetalle_Pedido").hide();

  $.post(
    "../../controllers/PedidoController.php",
    {
      task: 1,
      fechaI: $("#txtFechaInicio_Pedido").val(),
      fechaF: $("#txtFechaFin_Pedido").val(),
    },
    function (response) {
      let datos = JSON.parse(response);
      $("#btnReportar_Pedido").html('<i class="fa fa-play"></i> REPORTAR');
      $.each(datos, function (i) {
        tbody.append(`
            <tr>
                <td class="text-primary" onclick="listarDetallePedido(${datos[i].codigo})">${datos[i].codigo}</td>
                <td>${datos[i].estado}</td>
                <td>${datos[i].pedido}</td>
                <td>${datos[i].proveedor}</td>
                <td>${datos[i].fechaEntrega}</td>
            </tr>
        `);
      });

      tListaPedidos_Pedido = table.DataTable({
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

function listarDetallePedido(docentry) {
  if (tDetalle_Pedido) {
    tDetalle_Pedido.destroy();
  }
  let table = $("#tDetalle_Pedido");
  let tbody = $("#tbodyDetalle_Pedido");
  tbody.empty();
  $("#divLista_Pedido").hide();
  $("#divDetalle_Pedido").show();

  $.post(
    "../../controllers/PedidoController.php",
    { task: 2, docentry },
    function (response) {
      let datos = JSON.parse(response);

      if (datos.length > 0) {
        $("#txtGuia_Pedido").val(datos[0].guia);
        $("#txtNumDoc_Pedido").val(datos[0].documento);
        $("#txtFechaDoc_Pedido").val(datos[0].fecha);
        $("#txtEstado_Pedido").val(datos[0].estado);
        $("#selConformidad_Pedido").val(datos[0].conformidad);
        $("#selConformidad_Pedido").change();
        $("#txtComentario_Pedido").val(datos[0].observacion);
        $("#btnLayout_Pedido").html(
          `<button type="button" class="btn btn-primary btn-sm" onclick='layoutPedido(${docentry});'><i class="fa fa-fw fa-eye"></i> Ver layout</button>`
        );
        if (datos[0].estado !== "RECEPCIONADO") {
          $("#divArchivos_Pedido")
            .html(`<div style="display: flex; justify-content: center; align-items: center; border: 1px solid; padding: 10px; border-radius: 10px;">
                      <input allowClear type="file" id="inputFile" accept="application/pdf" multiple style="font-size: 10px; margin: 5px;" />
                      <button type="button" class="btn btn-success btn-sm" onclick="actualizarPedido('${datos[0].codigo}', '${datos[0].carpeta}', '${datos[0].year}', '${datos[0].mes}', '${datos[0].proveedor}', '${datos[0].fechaFormato}');" style="font-size: 10px; margin: 5px;"><i class="fa fa-fw fa-upload"></i> Cargar archivos</button>
                  </div>`);
          $("#selConformidad_Pedido").prop("disabled", false);
          $("#txtGuia_Pedido").prop("disabled", false);
        } else {
          $("#divArchivos_Pedido").html("");
          $("#selConformidad_Pedido").prop("disabled", true);
          $("#txtGuia_Pedido").prop("disabled", true);
        }

        $.each(datos, function (i) {
          tbody.append(
            `
            <tr>
                <td style="vertical-align: middle">${i + 1}</td>
                <td style="vertical-align: middle">${datos[i].item}</td>
                <td style="vertical-align: middle">${datos[i].descripcion}</td>
                <td style="vertical-align: middle">${datos[i].um}</td>
                <td style="vertical-align: middle" class="inputQPedida">${datos[i].cantidadPedida
            }</td>
                <td style="vertical-align: middle" class="inputQRecibida">${datos[i].cantidadRecibida
            }</td>
                <td style="vertical-align: middle"><input class="inputQRecepcionada" id="txtCantidadRecepcionada_${datos[i].item
            }" type="number" value="${parseFloat(
              datos[i].cantidadRecepcionada
            )}" ${parseFloat(datos[i].cantidadRecepcionada) === 0 ? "disabled" : ""
            } /></td>
            </tr>
            `
          );
        });

        tDetalle_Pedido = table.DataTable({
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

function habilitarComentariosPedido() {
  let value = $("#selConformidad_Pedido").val();
  if ($("#txtEstado_Pedido").val() !== "RECEPCIONADO") {
    if (value === "01") {
      $("#txtComentario_Pedido").prop("disabled", true);
    } else {
      $("#txtComentario_Pedido").prop("disabled", false);
      $("#txtComentario_Pedido").val("");
    }
  }
}

function layoutPedido(docentry) {
  let divLayout = $("#layout_Pedido");
  $.post(
    "../../controllers/PedidoController.php",
    { task: 4, docentry },
    function (response) {
      let datos = JSON.parse(response);
      divLayout.html(`
          <div style="border: 1px solid; display: flex; padding: 10px 0px;">
          <div style="display: flex; align-items: center; width: 20%;">
              <img src="../../media/logo.png" alt="3AAMSEQ SA" title="3AAMSEQ SA" width="100%">
          </div> 
          <div style="font-size: 8px; width: 80%;">
              <p style="margin: unset;">CAL.SANTA TERESA DE JESUS NRO. 139 URB. LA MERCED ET.1 LA LIBERTAD - TRUJILLO - TRUJILLO</p>
              <p style="margin: unset;">MZA. M LOTE. 18 URB. LOS PORTALES LA LIBERTAD - TRUJILLO - TRUJILLO</p>
              <p style="margin: unset;">AV. SANCHEZ CERRO NRO. 1675 PIURA - PIURA - PIURA</p>
              <p style="margin: unset;">AV. AUGUSTO B.LEGUIA NRO. 1592 LAMBAYEQUE - CHICLAYO - JOSE LEONARDO ORTIZ</p>
              <p style="margin: unset;">CAR.VIA DE EVITAMIENTO KM. 586 (OV.EL MILAGRO,COSTADO GRIFO REPSOL) LA LIBERTAD - TRUJILLO - HUANCHACO</p>
              <p style="margin: unset;">AV. VICTOR RAUL HAYA DE LA TO NRO. 2121 ANCASH - SANTA - CHIMBOTE</p>
              <p style="margin: unset;">CAR.PANAMERICANA SUR NRO. 350 (AV.VARIANTE DE UCHUMAYO KM 3.5) AREQUIPA - AREQUIPA - CERRO COLORADO</p>
              <p style="margin: unset;">AV. FERROCARRIL NRO. 3120 (ANEXO LA ESPERANZA) JUNIN - HUANCAYO - EL TAMBO</p>
              <p style="margin: unset;">MZA. B LOTE. 5 Z.I. VILLA EL SALVADOR (PARCELA 1) LIMA - LIMA - VILLA EL SALVADOR</p>
              <p style="margin: unset;">CAL.LOS MANGOS NRO. 350 URB. SEMI RUSTICA CANTO GRANDE LIMA - LIMA - SAN JUAN DE LURIGANCHO</p>
              <p style="margin: unset;">CAR.PIURA-SULLANA KM. 1006 (A 300 METROS DEL PUENTE LAS MONJAS) PIURA - PIURA - PIURA</p>
              <p style="margin: unset;">MZA. 37 LOTE. 1-A P.J. CHOSICA DEL NORTE (FRENTE AL HOTEL LOS DELFINES) LAMBAYEQUE - CHICLAYO - LA VICTORIA</p>
              <p style="margin: unset;">MZA. C-1 LOTE. 1 SEC. PARCELACIÓN ZAPALLAL LIMA - LIMA - PUENTE PIEDRA</p>
              <p style="margin: unset;">CAL.LOS MANGOS NRO. 362 URB. CANTO GRANDE LIMA - LIMA - SAN JUAN DE LURIGANCHO</p>
              <p style="margin: unset;">MZA. C3 LOTE. 5 HUACHIPA ESTE LIMA - HUAROCHIRI - SAN ANTONIO</p>
              <p style="margin: unset;">MZA. F LOTE. 08 URB. LA MERCED ET.1 LA LIBERTAD - TRUJILLO - TRUJILLO</p>
          </div>
        </div>
        <h3 style="text-align: center; margin: 10px;">PEDIDO ${datos[0].DocNum ?? "---"
        }</h3>
        <div>
          <div class="row" style="font-size: 13px;">
              <div class="col-sm-7">
                  <div class="row">
                      <div class="col-sm-12" style="padding-bottom: 15px;">
                          <p style="margin: unset;"><b>Empresa:</b> ${datos[0].NombreSocio ?? "---"
        }</p>
                          <p style="margin: unset;"><b>RUC:</b> ${datos[0].RUC ?? "---"
        }</p>
                          <p style="margin: unset;"><b>Domicilio Fiscal:</b> ${datos[0].DirPagar ?? "---"
        }</p>
                      </div>
                      <div class="col-sm-12" style="padding-bottom: 15px;">
                          <p style="margin: unset;"><b>Contacto:</b> ${datos[0].Contacto ?? "---"
        }</p>
                          <p style="margin: unset;"><b>Email:</b> ${datos[0].email ?? "---"
        }</p>
                          <p style="margin: unset;"><b>Teléfono:</b> ${datos[0].Celular ?? "---"
        }</p>
                      </div>
                      <div class="col-sm-12" style="padding-bottom: 15px;">
                          <p style="margin: unset;"><b>Sírvase suministrar a:</b> ${datos[0].NombreBD ?? "---"
        }</p>
                          <p style="margin: unset;"><b>RUC:</b> ${datos[0].RUCBD ?? "---"
        }</p>
                          <p style="margin: unset;"><b>Domicio Fiscal:</b> ${datos[0].DireccionBD ?? "---"
        }</p>
                      </div>
                      <div class="col-sm-12" style="padding-bottom: 15px;">
                          <p style="margin: unset;"><b>Fecha de entrega:</b> ${datos[0].FechaEntrega.date.substring(0, 10) ?? "---"
        }</p>
                      </div>
                  </div>
              </div>
              <dov class="col-sm-5">
                  <div class="row">
                      <div class="col-sm-12">
                          <div style="border: 1px solid; padding: 10px;">
                              <h5 style="text-align: center;">Pedido</h5>
                              <div class="row">
                                  <div class="col-sm-8"><b>Requerimiento</b></div>
                                  <div class="col-sm-4"><b>Fecha</b></div>
                              </div>
                              <div class="row">
                                  <div class="col-sm-8"> ${datos[0]["NAT-SOLCOMPRA"] ?? "---"
        }</div>
                                  <div class="col-sm-4"> ${datos[0].Fecha.date.substring(0, 10) ??
        "---"
        }</div>
                              </div>
                              <div class="row">
                                  <div class="col-sm-12"><b>Persona de Contacto / Tel.</b></div>
                              </div>
                              <div class="row">
                                  <div class="col-sm-12"> ${datos[0]["NAT-ELABORADO"]
        } / ${datos[0]["NAT-CELULAR"] ?? "---"}</div>
                              </div>
                              <div class="row">
                                  <div class="col-sm-12"><b>Email</b></div>
                              </div>
                              <div class="row">
                                  <div class="col-sm-12"> ${datos[0]["NAT-EMAIL"] ?? "---"
        }</div>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-12">
                          <p style="margin: unset;"><b>Sede de Entrega:</b> ${datos[0].SEDE
        }</p>
                          <p style="margin: unset;"><b>Dirección:</b> ${datos[0].DIRECCION_SEDE
        }</p>
                          <p style="margin: unset;"><b>Cond. Pago:</b> ${datos[0].CondicionPago
        }</p>
                          <p style="margin: unset;"><b>% Anticipo:</b> ${datos[0]["NAT-ANTICIPO"]
        }</p>
                          <p style="margin: unset;"><b>Moneda:</b> ${datos[0].MonedaLetras
        }</p>
                      </div>
                  </div>
              </dov>
              <div class="col-sm-12">
                  <p>Cotización Nro. ${datos[0].NroCotizProv ?? "---"}</p>
              </div>
              <div class="col-sm-12">
                  <table class="table table-bordered" style="width: 100%;">
                      <thead>
                          <th>Código</th>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                          <th>UM</th>
                          <th>Peso total</th>
                      </thead>
                      <tbody id="tLayout_Pedido">
                         
                      </tbody>
                  </table>
              </div>
              <div class="col-sm-12">
                  <h5>Observaciones</h5>
                  <p>${datos[0].Observaciones ?? "---"}</p>
              </div>
              <div class="col-sm-12">
                  <div class="row">
                      <div class="col-sm-6"></div>
                      <div class="col-sm-2" style="border: 1px solid;">
                          <div class="row">
                              <div class="col-sm-12" style="text-align: center;">
                                  <p><b>Solicitante</b></p>
                                  <p>${datos[0]["NAT-SOLICITANTE"] ?? "---"}</p>
                                  <p><b>Fecha:</b> ${datos[0]["NAT-SOLICITANTE-FECHA"]
          ? datos[0][
            "NAT-SOLICITANTE-FECHA"
          ].date.substring(0, 10)
          : "---"
        }</p>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2" style="border: 1px solid;">
                          <div class="row">
                              <div class="col-sm-12" style="text-align: center;">
                                  <p><b>Elaborado</b></p>
                                  <p>${datos[0]["NAT-ELABORADO"] ?? "---"}</p>
                                  <p><b>Fecha:</b> ${datos[0]["NAT-ELABORADO-FECHA"]
          ? datos[0][
            "NAT-ELABORADO-FECHA"
          ].date.substring(0, 10)
          : "---"
        }</p>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2" style="border: 1px solid;">
                          <div class="row">
                              <div class="col-sm-12" style="text-align: center;">
                                  <p><b>Aprobado</b></p>
                                  <p>${datos[0]["NAT-APROBADO"] ?? "---"}</p>
                                  <p><b>Fecha:</b> ${datos[0]["NAT-APROBADO-FECHA"]
          ? datos[0][
            "NAT-APROBADO-FECHA"
          ].date.substring(0, 10)
          : "---"
        }</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick='pdfPedido(${JSON.stringify(
          datos
        )});'><i class="fa fa-fw fa-print"></i> Descargar PDF</button>
        `);

      let tablaLayout = $("#tLayout_Pedido");
      $.each(datos, function (i) {
        tablaLayout.append(
          `<tr>
              <td>${datos[i].Codigo ?? "---"}</td>
              <td>${datos[i].Descripcion ?? "---"}</td>
              <td>${datos[i].Cantidad ?? "---"}</td>
              <td>${datos[i].UM ?? "---"}</td>
              <td>${datos[i].pesoTotal ?? "---"}</td>
          </tr>`
        );
      });
      $("#mdlLayout_Pedido").modal("toggle");
    }
  );
}

function pdfPedido(data) {
  let pdf = new jsPDF();

  // Cuadro encabezado
  pdf.setLineWidth(0.25);
  pdf.line(10, 10, 200, 10); // Arriba
  pdf.line(10, 50, 200, 50); // Abajo
  pdf.line(10, 10, 10, 50); // Izquierda
  pdf.line(200, 10, 200, 50); // Derecha

  // Encabezado
  let img = new Image();
  img.src = "../../media/logo.png";
  pdf.addImage(img, "png", 15, 22, 50, 15);

  pdf.setFontSize(5);
  pdf.setFontType("normal");
  pdf.text(
    "CAL.SANTA TERESA DE JESUS NRO. 139 URB. LA MERCED ET.1 LA LIBERTAD - TRUJILLO - TRUJILLO",
    76,
    16
  );
  pdf.text(
    "MZA. M LOTE. 18 URB. LOS PORTALES LA LIBERTAD - TRUJILLO - TRUJILLO",
    76,
    18
  );
  pdf.text("AV. SANCHEZ CERRO NRO. 1675 PIURA - PIURA - PIURA", 76, 20);
  pdf.text(
    "AV. AUGUSTO B.LEGUIA NRO. 1592 LAMBAYEQUE - CHICLAYO - JOSE LEONARDO ORTIZ",
    76,
    22
  );
  pdf.text(
    "CAR.VIA DE EVITAMIENTO KM. 586 (OV.EL MILAGRO,COSTADO GRIFO REPSOL) LA LIBERTAD - TRUJILLO - HUANCHACO",
    76,
    24
  );
  pdf.text(
    "AV. VICTOR RAUL HAYA DE LA TO NRO. 2121 ANCASH - SANTA - CHIMBOTE",
    76,
    26
  );
  pdf.text(
    "CAR.PANAMERICANA SUR NRO. 350 (AV.VARIANTE DE UCHUMAYO KM 3.5) AREQUIPA - AREQUIPA - CERRO COLORADO",
    76,
    28
  );
  pdf.text(
    "AV. FERROCARRIL NRO. 3120 (ANEXO LA ESPERANZA) JUNIN - HUANCAYO - EL TAMBO",
    76,
    30
  );
  pdf.text(
    "MZA. B LOTE. 5 Z.I. VILLA EL SALVADOR (PARCELA 1) LIMA - LIMA - VILLA EL SALVADOR",
    76,
    32
  );
  pdf.text(
    "CAL.LOS MANGOS NRO. 350 URB. SEMI RUSTICA CANTO GRANDE LIMA - LIMA - SAN JUAN DE LURIGANCHO",
    76,
    34
  );
  pdf.text(
    "CAR.PIURA-SULLANA KM. 1006 (A 300 METROS DEL PUENTE LAS MONJAS) PIURA - PIURA - PIURA",
    76,
    36
  );
  pdf.text(
    "MZA. 37 LOTE. 1-A P.J. CHOSICA DEL NORTE (FRENTE AL HOTEL LOS DELFINES) LAMBAYEQUE - CHICLAYO - LA VICTORIA",
    76,
    38
  );
  pdf.text(
    "MZA. C-1 LOTE. 1 SEC. PARCELACIÓN ZAPALLAL LIMA - LIMA - PUENTE PIEDRA",
    76,
    40
  );
  pdf.text(
    "CAL.LOS MANGOS NRO. 362 URB. CANTO GRANDE LIMA - LIMA - SAN JUAN DE LURIGANCHO",
    76,
    42
  );
  pdf.text(
    "MZA. C3 LOTE. 5 HUACHIPA ESTE LIMA - HUAROCHIRI - SAN ANTONIO",
    76,
    44
  );
  pdf.text(
    "MZA. F LOTE. 08 URB. LA MERCED ET.1 LA LIBERTAD - TRUJILLO - TRUJILLO",
    76,
    46
  );

  // Titulo
  pdf.setFontSize(14);
  pdf.setFontType("bold");
  pdf.text(`PEDIDO ${data[0].DocNum}`, 105, 60, "center");

  // Información leyenda
  // Derecha
  pdf.setFontSize(9);
  pdf.setFontType("bold");
  pdf.text("Empresa:", 10, 65);
  pdf.text("RUC:", 10, 75);
  pdf.text("Domicilio Fiscal:", 10, 80);
  pdf.text("Contacto:", 10, 90);
  pdf.text("Email:", 10, 95);
  pdf.text("Telefono:", 10, 100);
  pdf.text("Sírvase suministrar a:", 10, 110);
  pdf.text("RUC:", 10, 120);
  pdf.text("Domicilio Fiscal:", 10, 125);
  pdf.text("Fecha de entrega:", 10, 140);

  // Izquierda
  pdf.text("Sede de Entrega:", 120, 110);
  pdf.text("Dirección:", 120, 115);
  pdf.text("Cond. Pago:", 120, 120);
  pdf.text("% Anticipo:", 120, 125);
  pdf.text("Moneda:", 120, 130);

  // Información datos
  // Izquierda
  pdf.setFontSize(9);
  pdf.setFontType("normal");
  pdf.text(data[0].NombreSocio ?? "---", 10, 70);
  pdf.text(data[0].RUC ?? "---", 19, 75);
  pdf.text(
    data[0].DirPagar ? data[0].DirPagar.substring(0, 40) : "---",
    37,
    80
  );
  pdf.text(data[0].Contacto ?? "---", 27, 90);
  pdf.text(data[0].email ?? "---", 21, 95);
  pdf.text(data[0].Celular ?? "---", 26, 100);
  pdf.text(data[0].NombreBD ?? "---", 10, 115);
  pdf.text(data[0].RUCBD ?? "---", 19, 120);
  pdf.text(data[0].DireccionBD ?? "---", 10, 130);
  pdf.text(data[0].FechaEntrega.date.substring(0, 10) ?? "---", 38, 140);

  // Derecha
  pdf.text(data[0].SEDE ?? "---", 147, 110);
  pdf.text(data[0].DIRECCION_SEDE ?? "---", 137, 115);
  pdf.text(data[0].CondicionPago ?? "---", 140, 120);
  pdf.text(data[0]["NAT-ANTICIPO"] ?? "---", 138, 125);
  pdf.text(data[0].MonedaLetras ?? "---", 134, 130);

  // Cuadro PEDIDO
  pdf.line(120, 65, 200, 65); // Arriba
  pdf.line(120, 105, 200, 105); // Abajo
  pdf.line(120, 65, 120, 105); // Izquierda
  pdf.line(200, 65, 200, 105); // Derecha
  pdf.setFontSize(10);
  pdf.setFontType("bold");
  pdf.text("PEDIDO", 160, 70, "center");
  pdf.text("Requerimiento", 122, 75);
  pdf.text("Fecha", 180, 75);
  pdf.text("Persona de Contacto / Tel.", 122, 85);
  pdf.text("E-mail", 122, 95);
  //  Datos cuadro
  pdf.setFontSize(10);
  pdf.setFontType("normal");
  pdf.text(`${data[0]["NAT-SOLCOMPRA"] ?? "---"}`, 122, 80);
  pdf.text(data[0].Fecha.date.substring(0, 10) ?? "---", 180, 80);
  pdf.text(
    `${data[0]["NAT-ELABORADO"]} / ${data[0]["NAT-CELULAR"] ?? "---"}`,
    122,
    90
  );
  pdf.text(`${data[0]["NAT-EMAIL"] ?? "---"}`, 122, 100);

  // Cabecera de tabla
  pdf.text(`Cotización Nro. ${data[0].NroCotizProv ?? "---"}`, 10, 148);
  pdf.line(10, 150, 200, 150); // Arriba
  pdf.line(10, 157, 200, 157); // Abajo
  pdf.line(10, 150, 10, 157); // Izquierda
  pdf.line(200, 150, 200, 157); // Derecha

  pdf.text("Código", 12, 154);
  pdf.text("Descripción", 32, 154);
  pdf.text("Cantidad", 150, 154);
  pdf.text("UM", 170, 154);
  pdf.text("Peso total", 182, 154);

  pdf.setFontSize(9);
  let height = 0;
  $.each(data, function (i) {
    pdf.text(data[i].Codigo, 12, 161 + i * 5);
    pdf.text(data[i].Descripcion, 32, 161 + i * 5);
    pdf.text(Number.parseFloat(data[i].Cantidad).toFixed(2), 150, 161 + i * 5);
    pdf.text(data[i].UM ?? "", 170, 161 + i * 5);
    pdf.text(Number.parseFloat(data[i].pesoTotal).toFixed(2), 182, 161 + i * 5);
    height = 161 + i * 5;
  });

  // Comentarios
  pdf.setFontSize(10);
  pdf.setFontType("bold");
  pdf.text("Observaciones", 10, height + 10);
  pdf.setFontSize(10);
  pdf.setFontType("normal");
  pdf.text(data[0].Observaciones ?? "---", 10, height + 15);

  // Participantes tabla
  pdf.line(80, height + 30, 200, height + 30); // Arriba
  pdf.line(80, height + 48, 200, height + 48); // Abajo
  pdf.line(80, height + 30, 80, height + 48); // Izquierda
  pdf.line(120, height + 30, 120, height + 48); // Izquierda 1
  pdf.line(160, height + 30, 160, height + 48); // Izquierda 2
  pdf.line(200, height + 30, 200, height + 48); // Derecha

  // Participantes
  pdf.setFontSize(9);
  pdf.setFontType("bold");
  pdf.text("Solicitante:", 100, height + 35, "center");
  pdf.text("Elaborado:", 140, height + 35, "center");
  pdf.text("Aprobado:", 180, height + 35, "center");

  pdf.setFontType("normal");
  pdf.text(data[0]["NAT-SOLICITANTE"] ?? "---", 100, height + 40, "center");
  pdf.text(
    `Fecha: ${data[0]["NAT-SOLICITANTE-FECHA"]
      ? data[0]["NAT-SOLICITANTE-FECHA"].date.substring(0, 10)
      : "---"
    }`,
    100,
    height + 45,
    "center"
  );
  pdf.text(data[0]["NAT-ELABORADO"] ?? "---", 140, height + 40, "center");
  pdf.text(
    `Fecha: ${data[0]["NAT-ELABORADO-FECHA"]
      ? data[0]["NAT-ELABORADO-FECHA"].date.substring(0, 10)
      : "---"
    }`,
    140,
    height + 45,
    "center"
  );
  pdf.text(data[0]["NAT-APROBADO"] ?? "---", 180, height + 40, "center");
  pdf.text(
    `Fecha: ${data[0]["NAT-APROBADO-FECHA"]
      ? data[0]["NAT-APROBADO-FECHA"].date.substring(0, 10)
      : "---"
    }`,
    180,
    height + 45,
    "center"
  );

  // Guardar PDF
  pdf.save(`Pedido N°${data[0].DocNum}`);
}

async function actualizarPedido(
  docentry,
  sede,
  year,
  mes,
  proveedor,
  fechaRecepcion
) {
  const maxFileSize = 2 * 1024 * 1024;
  const patron = /09-\w{4}-\d+/;
  let pedido = $("#txtNumDoc_Pedido").val();
  let guia = $("#txtGuia_Pedido").val();
  let comentarios = $("#txtComentario_Pedido").val();
  let conformidad = $("#selConformidad_Pedido").val();
  let input = document.getElementById("inputFile");
  let estado = "R";
  let items = [];
  let itemsPedidos = [];
  let itemsRecibidos = [];

  if (!patron.test(guia)) {
    alert("::MENSAJE:\n[*] El número de guía no es válido");
    return;
  }

  if (input.files.length < 1) {
    alert("::MENSAJE:\n[*] Debes subir al menos un archivo");
    return;
  }

  let continuar = true;
  for (let i = 0; i < input.files.length; i++) {
    let size = input.files[i].size;
    let valido = await validarSubidaDeArchivos(
      input.files[i],
      sede,
      year,
      mes,
      proveedor,
      fechaRecepcion
    );
    if (size > maxFileSize) {
      alert(
        `::ERROR:\n[*] El archivo ${input.files[i].name} supera el tamaño permitido de ${maxFileSize}`
      );
      break;
    }
    if (!valido.success) {
      alert(`::ERROR:\n[*] ${valido.message}`);
      continuar = false;
      break;
    }
  }

  if (!continuar) {
    return;
  }

  if (conformidad === "00") {
    alert("::MENSAJE:\n[*] Selecciona si está conforme o no conforme");
    return;
  }

  if (
    confirm(
      "::CONFIRMACIÓN:\n[*] ¿Está seguro de subir los archivos? Esta acción es irreversible"
    )
  ) {
    $("#divLoading_Pedido").css("display", "block");
    $("td.inputQPedida").each(function (i, item) {
      itemsPedidos[i] = [parseFloat(item.innerHTML ?? 0)];
    });
    $("td.inputQRecibida").each(function (i, item) {
      itemsRecibidos[i] = [parseFloat(item.innerHTML ?? 0)];
    });

    $("input.inputQRecepcionada").each(function (i, item) {
      items.push({
        item: $(this).parents("tr").find("td").eq(1).text(),
        cantidadPendienteRecibida: parseFloat(
          item.value === "" ? 0 : item.value
        ),
        cantidadRecibida: parseFloat(itemsRecibidos[i]),
        cantidadPedida: parseFloat(itemsPedidos[i]),
      });
    });

    items.forEach((item, _) => {
      if (
        item.cantidadPedida !==
        item.cantidadRecibida + item.cantidadPendienteRecibida
      ) {
        estado = "RP";
        return;
      }
    });

    $.post(
      "../../controllers/PedidoController.php",
      {
        task: 3,
        items,
        guia,
        docentry,
        comentarios,
        conformidad,
        estado,
      },
      function (response) {
        let data = JSON.parse(response);
        if (data.success) {
          let lastId = data.lastId;
          let usuario = data.usuario;
          if (data.valor === items.length) {
            for (let i = 0; i < input.files.length; i++) {
              let formData = new FormData();
              formData.append("file", input.files[i]);
              formData.append("task", 5);
              formData.append("sede", sede);
              formData.append("year", year);
              formData.append("mes", mes);
              formData.append("proveedor", proveedor);
              formData.append("fechaRecepcion", fechaRecepcion);
              $.ajax({
                url: "../../controllers/PedidoController.php",
                dataType: "text",
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                type: "post",
                success: function (success) {
                  let data = JSON.parse(success);
                  if (data.success) {
                    $.post(
                      "../../controllers/PedidoController.php",
                      {
                        task: 6,
                        archivo: data.message,
                        pedido: lastId,
                      },
                      function (response) {
                        if (response !== "1") {
                          alert(
                            "::ERROR:\n[*] Error al guardar archivo. Por favor comunicarse con sistemas"
                          );
                          return;
                        }
                      }
                    );
                  } else {
                    alert(
                      "::ERROR:\n[*] Error al subir archivo. Por favor comunicarse con sistemas"
                    );
                    return;
                  }
                },
              });
            }
            listarPedidos();
            sendNotification(
              pedido,
              sede,
              usuario,
              proveedor,
              guia,
              conformidad
            );
          }

          $("#divLoading_Pedido").css("display", "none");
          alert(data.message);
        }
      }
    );
  }
}

async function validarSubidaDeArchivos(
  file,
  sede,
  year,
  mes,
  proveedoor,
  fechaRecepcion
) {
  let response = null;
  let formData = new FormData();
  formData.append("file", file);
  formData.append("task", 9);
  formData.append("sede", sede);
  formData.append("year", year);
  formData.append("mes", mes);
  formData.append("proveedor", proveedoor);
  formData.append("fechaRecepcion", fechaRecepcion);
  await $.ajax({
    url: "../../controllers/PedidoController.php",
    dataType: "text",
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    type: "post",
    success: function (success) {
      let data = JSON.parse(success);
      response = data;
    },
  });
  return response;
}

function sendNotification(pedido, sede, usuario, proveedor, guia, conformidad) {
  $.post(
    "../../controllers/UsuarioController.php",
    {
      task: 4,
    },
    function (response) {
      let rpta = $.parseJSON(response);
      rpta.forEach((data) => {
        sendPushNotification(data.tokenfcm, pedido, sede);
        sendMailNotification(
          data.correo,
          pedido,
          sede,
          usuario,
          proveedor,
          guia,
          conformidad
        );
      });
    }
  );
}

function sendPushNotification(token, pedido, sede) {
  let settings = {
    url: "https://fcm.googleapis.com/fcm/send",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization:
        "key=AAAAIZ8QssU:APA91bHG2bnhZ4b51Bwtg-aY_zo99lofkdaLex4zGm1sy_fmU3cSdGC9fUzBvdsCbl5LK1Uu97BvvrnoDNawSvXcgpjsf1lVzzz-uYOsTdVQSvhoEdvffKeI-9mecRmiYeCox6RVhNT1",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      to: token,
      notification: {},
      data: {
        title: "Pedido procesado",
        body: `RECEPCIÓN DE MERCADERÍA SEDE: ${sede} | PEDIDO ${pedido}`,
      },
    }),
  };

  $.ajax(settings).done(function () { });
}

function sendMailNotification(
  correo,
  pedido,
  sede,
  usuario,
  proveedor,
  guia,
  conformidad
) {
  $.post(
    "../../controllers/PedidoController.php",
    {
      task: 8,
      body: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>PRUEBA - RECEPCIÓN DE MERCADERÍA SEDE: ${sede} | PEDIDO ${pedido}</title>
        </head>
        <body>
          <div>
            <p>Usuario: <b>${usuario}</b></p>
            <p>N° Pedido: <b>${pedido}</b></p>
            <p>Proveedor: <b>${proveedor}</b></p>
            <p>N° Guía: <b>${guia}</b></p>
            <p>Conformidad: <b>${conformidad === "01" ? "CONFORME" : "NO CONFORME"
        }</b></p>
          </div>
        </body>
      </html>`,
      recipients: correo,
      subject: `PRUEBA - RECEPCIÓN DE MERCADERÍA SEDE: ${sede} | PEDIDO ${pedido}`,
    },
    function () { }
  );
}
