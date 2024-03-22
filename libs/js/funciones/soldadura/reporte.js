const controllerPE = "../../controllers/SoldaduraController.php";
const conformidad = "00";
var contadorMovimientos = -1;
var arrayMovimientos = [];
var docentry = 0;
var codigo = 0;
var cantidad = 0;
var peso = 0;
var usuario = "";
var sede = "";

function operacion(opera)
{
  codigo = "S"+opera.toString().padStart(5, '00000');
  //console.log(opera);
  return codigo;
}

function jsListarSobrantes() {
    // const btnLayout = document.getElementById("btnLayout");
    // btnLayout.innerHTML = `<button type="button" class="btn btn-primary btn-sm" onclick='layout(${docentry});'><i class="fa fa-fw fa-eye"></i> Ver layout</button>`;
    var contenedorTabla = $("#divTablaSobrantes");
    contenedorTabla.empty();
    contenedorTabla.append(
      `<table id='tblSobrantes' class='table table-bordered table-striped'>
          <thead class='table-dark'>
              <tr>
                  <th>Código</th>
                  <th>Empleado</th>
                  <th>Descripción</th>
                  <th>KG</th>
                  <th>Fecha de Registro</th>
                  <th>Cantidad</th>
                  <th>Estados</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody id='tblSobrantesLista'>
              <tr>
                  <td colspan='10'><i class='fa fa-spinner fa-spin fa-2x'></i></td>
              </tr>
          </tbody>
      </table>`
    );
  
    $.get(
      "../../controllers/SoldaduraController.php",
      { task: 7 },
      function (response) {
        //console.log(response);
        var datos = $.parseJSON(response);
        $("#tblSobrantesLista").empty();
        let color = "";
        let texto = "";
        $.each(datos, function (i) {
          docentry = datos[i].codigo;
          cantidad = datos[i].cantidad;
          peso = datos[i].Kg;
          usuario = datos[i].empleado;
          sede = datos[i].Sede;
          operacion(docentry);
          //codigo = "S"+docentry.toString().padStart(5, '00000');
          //codigo = localStorage.setItem('codigo', docentry);
          if (datos[i].estados === "Pendiente") {
            color = "#ffc107";
            texto = "#000000";
          }
          if (datos[i].estados === "Rechazado") {
            color = "#f44336";
            texto = "#FFFFFF";
          }
          if (datos[i].estados === "Confirmado") {
            color = "#4caf50";
            texto = "#FFFFFF";
          }
          $("#tblSobrantesLista").append(
            `<tr>
              <td>${datos[i].codigo}</td>
              <td>${datos[i].empleado}</td>
              <td>${datos[i].descripcion}</td>
              <td>${datos[i].Kg}</td>
              <td>${datos[i].fechaRegistro.date.slice(0, -7)}</td>
              <td>${datos[i].cantidad}</td>
              <td onclick='jsVerConfirmacion(${JSON.stringify(
                datos[i])})'><div style="background: ${color}; padding: 4px; color: ${texto};"><b>${
              datos[i].estados
            }</b></div></td>
              <td onclick='jsVerDetalleSobrantes(${JSON.stringify(
                datos[i]
              )})'><i class='fa fa-angle-double-right'></i> Ver detalles</td>
            </tr>`
          );
        });
        $("#tblSobrantes").DataTable({
          dom: "frtip",
          order: [[0, "desc"]],
          pageLength: 25,
          language: { url: "../../libs/datatables/dt_spanish.json" },
        });
      }
    );
  }

  function jsNotificadorSobrantes() {
    $.get(
      "../../controllers/SoldaduraController.php",
      { task: 6 },
      function (response) {
        console.log(response);
        var datos = $.parseJSON(response);
        if (contadorMovimientos < 0) {
          arrayMovimientos = datos;
          contadorMovimientos = datos.length;
        } else if (contadorMovimientos < datos.length) {
          jsNotificarSobrantes();
          jsListarSobrantes();
          arrayMovimientos = datos;
          contadorMovimientos = datos.length;
        } else if (contadorMovimientos === datos.length) {
          var totalSumaMov = 0;
          for (var i = 0; i < arrayMovimientos.length; i++) {
            totalSumaMov = arrayMovimientos[i].id_mov + totalSumaMov;
          }
          var totalSumaBDMov = 0;
          for (var j = 0; j < datos.length; j++) {
            totalSumaBDMov = datos[j].id_mov + totalSumaBDMov;
          }
          if (totalSumaMov < totalSumaBDMov) {
            jsNotificarSobrantes();
            jsListarSobrantes();
            arrayMovimientos = datos;
            contadorMovimientos = datos.length;
          }
        } else {
          var arrayAux = [];
          $.each(arrayMovimientos, function (i) {
            arrayAux[i] = arrayMovimientos[i].id_mov;
          });
          var indice = 0;
          for (var k = 0; k < datos.length && indice > -1; k++) {
            indice = $.inArray(datos[k].id_mov, arrayAux);
          }
          if (indice < 0) {
            jsNotificarSobrantes();
          }
          jsListarSobrantes();
          arrayMovimientos = datos;
          contadorMovimientos = datos.length;
        }
      }
    );
  }

  function jsVerDetalleSobrantes(sobrante) {
    $("#dmlSobrante").modal("toggle");
    $("#divCabeceraDev").html(
      `<i class='fa fa-folder-open-o'></i> Varillas Sobrantes # ${sobrante.codigo}: DETALLES`
    );
    $("#emailEmpleado").val(sobrante.correo);
    $("#nombreEmpleado").val(sobrante.empleado);
    $("#adjunto").html(
      `<input class="form-control form-control-sm" id="nombreDocumento" type="text" value="${sobrante.documento}" readonly>
       <a href="http://amseq-files/ALMACEN%20-%20TIENDA/99.%20OFICINA%20LARCO/RECEPCI%C3%93N%20DE%20SOLDADURA%20-%20ALMAC%C3%89N/2024/02.%20FEBRERO/KILEO%20SOLDADURA%20SOBRANTE/28-02-2024/${sobrante.documento}" target="_blank">>>Ver adjunto</a>`
    );
    $("#fechaPesaje").val(sobrante.fechaPesaje.date.slice(0, -7));
    $("#estado").val(sobrante.estados);
    $("#txtID").val(sobrante.codigo);
    $.post(
      "../../controllers/SoldaduraController.php",
      { task: 9, codigo: sobrante.codigo },
      function (response) {
        var datos = $.parseJSON(response);
        $("#mdlTblDatosDetalle").empty();
        $.each(datos, function (i) {
          $("#mdlTblDatosDetalle").append(`
          <tr>
              <td>${datos[i].codigo}</td>
              <td>${datos[i].usuario}</td>
              <td>${datos[i].fecha}</td>
              <td>${datos[i].hora}</td>
              <td>${datos[i].estado}</td>
              <td>${datos[i].comentarios}</td>
          </tr>`);
        });
      }
    );
  }

  function jsVerConfirmacion(sobrante) {
    var op = operacion(sobrante.codigo);
    //console.log(op);
    $("#txtOP").val(op);
    if(sobrante.estados === 'Pendiente')
    {
      $("#dmlConfirmacion").modal("toggle");
      $("#divCabeceraDev").html(
        `<i class='fa fa-folder-open-o'></i> Varillas Sobrantes de Soldadura # ${sobrante.codigo}: CONFIRMAR`
      );
    }
    if(sobrante.estados === 'Conforme')
    {
      conformidad = "01";
    }
    if(sobrante.estados === 'Rechazado')
    {
      conformidad = "02";
    }
    sendNotification(
      sobrante.codigo,
      sobrante.Sede,
      sobrante.Responsable,
      sobrante.proveedor,
      conformidad
    );
  }

  function jsActualizarConformidad(estado) {
    // 1: Confirmar
    // 0: Rechazar
    let numOpera = "S"+docentry.toString().padStart(5, '00000');
    let fechaConfirmacion = document.getElementById('txtFC').value;
    let comentario = document.getElementById('txtComentarios').value;
    //let archivo = document.getElementById('txtDocumento').value;
  
    // if (archivo == ''){
    //   alert("Sube un archivo en formato PDF, JPEG");
    //   return;
    // }
  
    var data = new FormData($("#frmAutorizacion")[0]);
    data.append("task",9);
    data.append("codigo", docentry)
    data.append("operacion", numOpera)
    data.append("txtFC", fechaConfirmacion)
    data.append("txtComentarios", comentario)
    data.append("estado", estado)
  
    if(confirm(msjConfirmacion)) {
      $.ajax({
        data: data,
        dataType: "json",
        type: "post",
        url: "../../controllers/SoldaduraController.php",
        contentType: false,
        processData: false,
        success: function (response) {
          console.log(response);
          if (response.data.estado == "1") {
            const conformidad2 = "01";
            const task = 4;
            $.post(
              "../../controllers/UsuarioController.php",
              {
                task,
              },
              function (response) {
                console.log(response);
                const data = JSON.parse(response);
                data.forEach((element) => {
                  mailConfirmacion(
                    element.correo,
                    numOpera,
                    cantidad,
                    peso,
                    sede,
                    usuario,
                    conformidad2
                  )
                });
              }
            );
            alert("::MENSAJE:\n[*] Actualizacion existosa");
          } else {
            if(response.data.estado == "0")
            {
              const conformidad2 = "00";
              const task = 4;
              $.post(
                "../../controllers/UsuarioController.php",
                {
                  task,
                },
                function (response) {
                  console.log(response);
                  const data = JSON.parse(response);
                  data.forEach((element) => {
                    mailConfirmacion(
                      element.correo,
                      numOpera,
                      cantidad,
                      peso,
                      sede,
                      usuario,
                      conformidad2
                    )
                  });
                }
              );
              alert("::MENSAJE:\n[*] Actualizacion existosa");
            }
            else
            {
              alert(
                "::MENSAJE:\n[*] ::MENSAJE:\n[*] No se pudo realizar la actualizacion"
              );
            }
          }
          jsListarSobrantes();
          $("#dmlConfirmacion").modal("toggle");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }
  }

  function jsNotificarSobrantes() {
    if (!("Notification" in window)) {
    } else if (Notification.permission === "granted") {
      var options = {
        body: "Solicitud registrada",
        icon: "../media/logotipo.png",
        dir: "ltr",
      };
      var n = new Notification("AMSEQ informa", options);
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
          n.close();
        }
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        if (!("permission" in Notification)) {
          Notification.permission = permission;
        }
        if (permission === "granted") {
          var options = {
            body: "Solicitud registrada",
            icon: "../media/logotipo.png",
            dir: "ltr",
          };
          var n = new Notification("AMSEQ informa:", options);
          document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible") {
              n.close();
            }
          });
        }
      });
    }
  }

function mailNotification(
  recipients,
  sobrante,
  sede,
  usuario,
  proveedor,
  conformidad
) {
  const task = 10;
  const subject = `PRUEBA - RECEPCIÓN SOBRANTE DE SOLDADURA MERCADERÍA SEDE: ${sede} | CODIGO: ${sobrante}`;
  const body = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PRUEBA - RECEPCIÓN SOBRANTE DE SOLDADURA MERCADERÍA SEDE: ${sede} | CODIGO: ${sobrante}</title>
      </head>
      <body>
        <div>
          <p>Usuario: <b>${usuario}</b></p>
          <p>N° Varilla Sobrante: <b>${sobrante}</b></p>
          <p style="display: none">Proveedor: <b>${proveedor}</b></p>
          <p>Conformidad: <b>${
            conformidad === "01" ? "CONFORME" : "NO CONFORME"
          }</b></p>
        </div>
      </body>
    </html>`;
  $.post(
    controllerPE,
    {
      task,
      body,
      recipients,
      subject,
    },
    function (_) {}
  );
}

function pushNotification(token, sobrante, sede) {
  $.ajax({
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
        title: "Soldadura sobrante procesado",
        body: `RECEPCIÓN DE PESAJE VARILLAS SOLDADURA MERCADERÍA SEDE: ${sede} | PEDIDO ${sobrante}`,
      },
    }),
  }).done(function () {});
}

function sendNotification(sobrante, sede, usuario, proveedor, conformidad) {
  const task = 4;
  $.post(
    "../../controllers/UsuarioController.php",
    {
      task,
    },
    function (response) {
      console.log(response);
      const data = JSON.parse(response);
      data.forEach((element) => {
        pushNotification(element.tokenfcm, sobrante, sede);
        mailNotification(
          element.correo,
          sobrante,
          sede,
          usuario,
          proveedor,
          conformidad
        );
      });
    }
  );
}

function mailConfirmacion(
  recipients,
  sobrante,
  cantidad,
  peso,
  sede,
  usuario,
  conformidad
) {
  const task = 10;
  const subject = `CONFIRMACIÓN - SOBRANTE DE SOLDADURA MERCADERÍA SEDE: ${sede} | CODIGO: ${sobrante}`;
  const body = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CONFIRMACION - RECEPCIÓN SOBRANTE DE SOLDADURA MERCADERÍA SEDE: ${sede} | CODIGO: ${sobrante}</title>
      </head>
      <body>
        <div>
          <p>Usuario: <b>${usuario}</b></p>
          <p>N° Confirmacion: <b>${sobrante}</b></p>
          <p>Cantidad: <b>${cantidad}</b></p>
          <p>Peso: <b>${peso}</b></p>
          <p>Conformidad: <b>${
            conformidad === "01" ? "CONFORME" : "NO CONFORME"
          }</b></p>
        </div>
      </body>
    </html>`;
  $.post(
    controllerPE,
    {
      task,
      body,
      recipients,
      subject,
    },
    function (_) {}
  );
}

function layout(docentry) {
  const divLayout = document.getElementById("layout");
  const task = 16;
  $.post(controllerPE, { task, docentry }, function (response) {
    console.log(response);
    const datos = JSON.parse(response);
    divLayout.innerHTML = `
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
        <h3 style="text-align: center; margin: 10px;">PEDIDO ${
          datos[0].DocNum ?? "---"
        }</h3>
        <div>
          <div class="row" style="font-size: 13px;">
              <div class="col-sm-7">
                  <div class="row">
                      <div class="col-sm-12" style="padding-bottom: 15px;">
                          <p style="margin: unset;"><b>Empresa:</b> ${
                            datos[0].NombreSocio ?? "---"
                          }</p>
                          <p style="margin: unset;"><b>RUC:</b> ${
                            datos[0].RUC ?? "---"
                          }</p>
                          <p style="margin: unset;"><b>Domicilio Fiscal:</b> ${
                            datos[0].DirPagar ?? "---"
                          }</p>
                      </div>
                      <div class="col-sm-12" style="padding-bottom: 15px;">
                          <p style="margin: unset;"><b>Contacto:</b> ${
                            datos[0].Contacto ?? "---"
                          }</p>
                          <p style="margin: unset;"><b>Email:</b> ${
                            datos[0].email ?? "---"
                          }</p>
                          <p style="margin: unset;"><b>Teléfono:</b> ${
                            datos[0].Celular ?? "---"
                          }</p>
                      </div>
                      <div class="col-sm-12" style="padding-bottom: 15px;">
                          <p style="margin: unset;"><b>Sírvase suministrar a:</b> ${
                            datos[0].NombreBD ?? "---"
                          }</p>
                          <p style="margin: unset;"><b>RUC:</b> ${
                            datos[0].RUCBD ?? "---"
                          }</p>
                          <p style="margin: unset;"><b>Domicio Fiscal:</b> ${
                            datos[0].DireccionBD ?? "---"
                          }</p>
                      </div>
                      <div class="col-sm-12" style="padding-bottom: 15px;">
                          <p style="margin: unset;"><b>Fecha de entrega:</b> ${
                            datos[0].FechaEntrega.date.substring(0, 10) ?? "---"
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
                                  <div class="col-sm-8"> ${
                                    datos[0]["NAT-SOLCOMPRA"] ?? "---"
                                  }</div>
                                  <div class="col-sm-4"> ${
                                    datos[0].Fecha.date.substring(0, 10) ??
                                    "---"
                                  }</div>
                              </div>
                              <div class="row">
                                  <div class="col-sm-12"><b>Persona de Contacto / Tel.</b></div>
                              </div>
                              <div class="row">
                                  <div class="col-sm-12"> ${
                                    datos[0]["NAT-ELABORADO"]
                                  } / ${datos[0]["NAT-CELULAR"] ?? "---"}</div>
                              </div>
                              <div class="row">
                                  <div class="col-sm-12"><b>Email</b></div>
                              </div>
                              <div class="row">
                                  <div class="col-sm-12"> ${
                                    datos[0]["NAT-EMAIL"] ?? "---"
                                  }</div>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-12">
                          <p style="margin: unset;"><b>Sede de Entrega:</b> ${
                            datos[0].SEDE
                          }</p>
                          <p style="margin: unset;"><b>Dirección:</b> ${
                            datos[0].DIRECCION_SEDE
                          }</p>
                          <p style="margin: unset;"><b>Cond. Pago:</b> ${
                            datos[0].CondicionPago
                          }</p>
                          <p style="margin: unset;"><b>% Anticipo:</b> ${
                            datos[0]["NAT-ANTICIPO"]
                          }</p>
                          <p style="margin: unset;"><b>Moneda:</b> ${
                            datos[0].MonedaLetras
                          }</p>
                      </div>
                  </div>
              </dov>
              <div class="col-sm-12">
                  <p>Cotización Nro. ${datos[0].NroCotizProv ?? "---"}</p>
              </div>
              <div class="col-sm-12">
                  <table class="table table-bordered" style="width: 100%;">
                      <thead class="table-dark">
                          <th>Código</th>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                          <th>UM</th>
                          <th>Peso total</th>
                      </thead>
                      <tbody id="tLayout">
                         
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
                                  <p><b>Fecha:</b> ${
                                    datos[0]["NAT-SOLICITANTE-FECHA"]
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
                                  <p><b>Fecha:</b> ${
                                    datos[0]["NAT-ELABORADO-FECHA"]
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
                                  <p><b>Fecha:</b> ${
                                    datos[0]["NAT-APROBADO-FECHA"]
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
        <button type="button" class="btn btn-primary btn-sm" onclick='pdf(${JSON.stringify(
          datos
        )});'><i class="fa fa-fw fa-download"></i> Descargar PDF</button>
        `;

    const tLayout = document.getElementById("tLayout");
    datos.forEach((element) => {
      tLayout.innerHTML += `<tr>
        <td>${element.Codigo ?? "---"}</td>
        <td>${element.Descripcion ?? "---"}</td>
        <td>${element.Cantidad ?? "---"}</td>
        <td>${element.UM ?? "---"}</td>
        <td>${element.pesoTotal ?? "---"}</td>
      </tr>`;
    });

    $("#mdlLayout").modal("toggle");
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