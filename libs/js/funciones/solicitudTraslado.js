var tListaSolicitudes_SolicitudTrasladoAdm = null;
var tDetalle_SolicitudTrasladoAdm = null;
var tListaSolicitudes_SolicitudTraslado = null;
var tDetalle_SolicitudTraslado = null;

function listarSolicitudesAdm() {
  if (tListaSolicitudes_SolicitudTrasladoAdm) {
    tListaSolicitudes_SolicitudTrasladoAdm.destroy();
  }
  let table = $("#tListaSolicitudes_SolicitudTrasladoAdm");
  let tbody = $("#tbodyLista_SolicitudTrasladoAdm");
  tbody.empty();
  $("#btnReportar_SolicitudTrasladoAdm").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_SolicitudTrasladoAdm").show();
  $("#divDetalle_SolicitudTrasladoAdm").hide();

  $.post(
    "../../controllers/SolicitudTrasladoController.php",
    {
      task: 8,
      fechaI: $("#txtFechaInicio_SolicitudTrasladoAdm").val(),
      fechaF: $("#txtFechaFin_SolicitudTrasladoAdm").val(),
    },
    function (response) {
      $("#btnReportar_SolicitudTrasladoAdm").html(
        '<i class="fa fa-play"></i> REPORTAR'
      );
      let datos = JSON.parse(response);

      $.each(datos, function (i) {
        tbody.append(
          ` <tr>
              <td class="text-primary" onclick="listarDetalleSolicitudAdm(${datos[i].docentry}, '${datos[i].codigoSede}')">${datos[i].docentry}</td>
              <td>${datos[i].guia}</td>
              <td>${datos[i].fecha}</td>
              <td>${datos[i].sede}</td>
              <td>${datos[i].usuario}</td>
              <td>${datos[i].origen}</td>
              <td>${datos[i].destino}</td>
              <td>${datos[i].categoriaVehiculo}</td>
              <td>${datos[i].modalidadTraslado}</td>
              <td>${datos[i].transportista}</td>
              <td>${datos[i].pesoTotal}</td>
              <td>${datos[i].estado}</td>
            </tr>`
        );
      });

      tListaSolicitudes_SolicitudTrasladoAdm = table.DataTable({
        dom: "Bftlp",
        buttons: ["excelHtml5", "pdfHtml5"],
        scrollCollapse: true,
        paging: true,
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

function listarDetalleSolicitudAdm(docentry, sede) {
  if (tDetalle_SolicitudTrasladoAdm) {
    tDetalle_SolicitudTrasladoAdm.destroy();
  }
  let table = $("#tDetalle_SolicitudTrasladoAdm");
  let tbody = $("#tbodyDetalle_SolicitudTrasladoAdm");
  tbody.empty();
  $("#divLista_SolicitudTrasladoAdm").hide();
  $("#divDetalle_SolicitudTrasladoAdm").show();

  $.post(
    "../../controllers/SolicitudTrasladoController.php",
    { task: 2, docentry, sede },
    function (response) {
      let datos = JSON.parse(response);

      if (datos.length > 0) {
        $("#txtNumGuia_SolicitudTrasladoAdm").val(datos[0].guia);
        $("#txtNumGuiaT_SolicitudTrasladoAdm").val(datos[0].guiaT);
        $("#txtNumDoc_SolicitudTrasladoAdm").val(datos[0].docnum);
        $("#txtFechaDoc_SolicitudTrasladoAdm").val(datos[0].fecha);
        $("#txtEstado_SolicitudTrasladoAdm").val(datos[0].estado);
        $("#txtComentario_SolicitudTrasladoAdm").val(datos[0].comentarios);
        $("#txtConformidad_SolicitudTrasladoAdm").val(datos[0].conformidad);
        $.each(datos, function (i) {
          tbody.append(
            `<tr>
            <td style="vertical-align: middle">${i + 1}</td>
            <td style="vertical-align: middle">${datos[i].itemcode}</td>
            <td style="vertical-align: middle">${datos[i].descripcion}</td>
            <td style="vertical-align: middle">${datos[i].cantidad}</td>
            <td><input type="number" class="form-control form-control-sm inputsNmb" id="${
              datos[i].linenum
            }" value="${datos[i].cantidadRecibida}" ${
              datos[0].estado === "Procesada" ? "disabled" : ""
            }/></td>
          </tr>`
          );
        });

        tDetalle_SolicitudTrasladoAdm = table.DataTable({
          dom: "Bftlp",
          buttons: ["excelHtml5", "pdfHtml5"],
          scrollCollapse: true,
          paging: true,
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

function listarSolicitudes() {
  if (tListaSolicitudes_SolicitudTraslado) {
    tListaSolicitudes_SolicitudTraslado.destroy();
  }
  let table = $("#tListaSolicitudes_SolicitudTraslado");
  let tbody = $("#tbodyLista_SolicitudTraslado");
  tbody.empty();
  $("#btnReportar_SolicitudTraslado").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_SolicitudTraslado").show();
  $("#divDetalle_SolicitudTraslado").hide();

  $.post(
    "../../controllers/SolicitudTrasladoController.php",
    {
      task: 1,
      fechaI: $("#txtFechaInicio_SolicitudTraslado").val(),
      fechaF: $("#txtFechaFin_SolicitudTraslado").val(),
    },
    function (response) {
      $("#btnReportar_SolicitudTraslado").html(
        '<i class="fa fa-play"></i> REPORTAR'
      );
      let datos = JSON.parse(response);

      $.each(datos, function (i) {
        tbody.append(
          ` <tr>
              <td class="text-primary" onclick="listarDetalleSolicitud(${datos[i].docentry})">${datos[i].docentry}</td>
              <td>${datos[i].guia}</td>
              <td>${datos[i].fecha}</td>
              <td>${datos[i].origen}</td>
              <td>${datos[i].categoriaVehiculo}</td>
              <td>${datos[i].modalidadTraslado}</td>
              <td>${datos[i].transportista}</td>
              <td>${datos[i].pesoTotal}</td>
              <td>${datos[i].estado}</td>
            </tr>`
        );
      });

      tListaSolicitudes_SolicitudTraslado = table.DataTable({
        dom: "Bftlp",
        buttons: ["excelHtml5", "pdfHtml5"],
        scrollCollapse: true,
        paging: true,
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

function listarDetalleSolicitud(docentry) {
  if (tDetalle_SolicitudTraslado) {
    tDetalle_SolicitudTraslado.destroy();
  }
  let table = $("#tDetalle_SolicitudTraslado");
  let tbody = $("#tbodyDetalle_SolicitudTraslado");
  tbody.empty();
  $("#divLista_SolicitudTraslado").hide();
  $("#divDetalle_SolicitudTraslado").show();

  $.post(
    "../../controllers/SolicitudTrasladoController.php",
    { task: 2, docentry },
    function (response) {
      let datos = JSON.parse(response);

      if (datos.length > 0) {
        $("#txtNumGuia_SolicitudTraslado").val(datos[0].guia);
        $("#txtNumGuiaT_SolicitudTraslado").val(datos[0].guiaT);
        $("#txtNumDoc_SolicitudTraslado").val(datos[0].docnum);
        $("#txtFechaDoc_SolicitudTraslado").val(datos[0].fecha);
        $("#txtEstado_SolicitudTraslado").val(datos[0].estado);
        $("#txtComentario_SolicitudTraslado").val(datos[0].comentarios);
        $("#selConformidad_SolicitudTraslado").val(datos[0].conformidad);
        $("#selConformidad_SolicitudTraslado").change();

        if (datos[0].archivos <= 0) {
          $("#divArchivos_SolicitudTraslado").html(
            `<div style="display: flex; justify-content: center; align-items: center; border: 1px solid; padding: 10px; border-radius: 10px;"><input allowClear type="file" id="inputFileST" accept="image/jpeg,image/jpg,image/png,application/pdf" multiple style="font-size: 10px; margin: 5px;" /><button type="button" class="btn btn-success btn-small" onclick="subirFilesSolicitudes(${datos[0].docentry});" style="font-size: 10px; margin: 5px;"><i class="fa fa-fw fa-upload"></i> Cargar archivos</button></div>`
          );
        } else {
          $("#divArchivos_SolicitudTraslado").html("");
        }

        if (datos[0].estado !== "Procesada") {
          $("#btnProcesar_SolicitudTraslado").html(
            `<div class="pull-right mt-3 mb-3 text-center" style="width: 100%"><button type="button" class="btn btn-sm btn-success" onclick="procesarSolicitud(${datos[0].docentry}, ${datos[0].docnum}, '${datos[0].sede}', '${datos[0].origen}', '${datos[0].destino}', '${datos[0].modalidadTraslado}', '${datos[0].guia}', ${datos[0].archivos});">Procesar</button></div>`
          );
          $("#selConformidad_SolicitudTraslado").prop("disabled", false);
          $("#txtNumGuiaT_SolicitudTraslado").prop("disabled", false);
        } else {
          $("#divArchivos_SolicitudTraslado").html("");
          $("#btnProcesar_SolicitudTraslado").html("");
          $("#selConformidad_SolicitudTraslado").prop("disabled", true);
          $("#txtNumGuiaT_SolicitudTraslado").prop("disabled", true);
        }

        $.each(datos, function (i) {
          tbody.append(
            `<tr>
            <td style="vertical-align: middle">${i + 1}</td>
            <td style="vertical-align: middle">${datos[i].itemcode}</td>
            <td style="vertical-align: middle">${datos[i].descripcion}</td>
            <td style="vertical-align: middle">${datos[i].cantidad}</td>
            <td><input type="number" class="form-control form-control-sm inputsNmb" id="${
              datos[i].linenum
            }" value="${datos[i].cantidadRecibida}" ${
              datos[0].estado === "Procesada" ? "disabled" : ""
            }/></td>
          </tr>`
          );
        });

        tDetalle_SolicitudTraslado = table.DataTable({
          dom: "Bftlp",
          buttons: ["excelHtml5", "pdfHtml5"],
          scrollCollapse: true,
          paging: true,
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

function habilitarComentariosSolicitud() {
  let value = $("#selConformidad_SolicitudTraslado").val();
  if ($("#txtEstado_SolicitudTraslado").val() !== "RECEPCIONADO") {
    if (value === "01") {
      $("#txtComentario_SolicitudTraslado").prop("disabled", true);
    } else {
      $("#txtComentario_SolicitudTraslado").prop("disabled", false);
      $("#txtComentario_SolicitudTraslado").val("");
    }
  }
}

function procesarSolicitud(
  docentry,
  solicitud,
  sede,
  origen,
  destino,
  modalidad,
  guia,
  archivos
) {
  if (archivos <= 0) {
    alert("::MENSAJE:\n[*] No adjuntaste tus guías");
    return;
  }

  const patron = /31-\w{4}-\d+/;
  let guiaT = $("#txtNumGuiaT_SolicitudTraslado").val();
  let conformidad = $("#selConformidad_SolicitudTraslado").val();
  let observacion = $.trim($("#txtComentario_SolicitudTraslado").val());
  let items = [];

  if (!patron.test(guiaT)) {
    alert("::MENSAJE:\n[*] El número de guía no es válido");
    return;
  }

  if (conformidad === "00") {
    alert("::MENSAJE:\n[*] Selecciona si está conforme o no conforme");
    return;
  }

  $("input.inputsNmb").each(function (i, item) {
    items[i] = [
      $(this).attr("id"),
      $(this).parents("tr").find("td").eq(1).text(),
      parseFloat(item.value),
    ];
  });

  let continuar = false;
  for (let i = 0; i < items.length; i++) {
    if (items[i][2] > 0) {
      continuar = true;
      break;
    }
  }
  if (!continuar) {
    alert("::MENSAJE:\n[*] Debes indicar la cantidad recepcionada");
    return;
  }

  if (
    confirm(
      "::MENSAJE:\n[*] ¿Está seguro de procesare la guía? Recuerda que las guías procesadas no pueden modificarse."
    )
  ) {
    $.post(
      "../../controllers/SolicitudTrasladoController.php",
      {
        task: 3,
        arrayItems: items,
        docentry,
        observacion,
        conformidad,
        guiaT,
      },
      function (response) {
        let data = JSON.parse(response);
        if (data.success) {
          let usuario = data.usuario;
          listarSolicitudes();
          sendNotificationSolicitudTraslado(
            solicitud,
            sede,
            usuario,
            origen,
            destino,
            modalidad,
            guia
          );
        }
        alert(data.message);
      }
    );
  }
}

async function subirFilesSolicitudes(docentry) {
  const maxFileSize = 5 * 1024 * 1024;
  let input = document.getElementById("inputFileST");
  if (input.files.length >= 1) {
    if (
      confirm(
        "::MENSAJE:\n[*] ¿Está seguro de subir los archivos? Esta acción es irreversible"
      )
    ) {
      for (let i = 0; i < input.files.length; i++) {
        let size = input.files[i].size;
        if (size > maxFileSize) {
          alert(
            `::ERROR:\n[*] El archivo ${input.files[i].name} supera el tamaño permitido de ${maxFileSize}`
          );
          return;
        }

        let formData = new FormData();
        formData.append("file", input.files[i]);
        formData.append("task", 5);
        await $.ajax({
          url: "../../controllers/SolicitudTrasladoController.php",
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
                "../../controllers/SolicitudTrasladoController.php",
                {
                  task: 6,
                  archivo: data.message,
                  solicitud: docentry,
                },
                function (response) {
                  if (response == "1") {
                    exito = true;
                  } else {
                    alert(
                      "::ERROR:\n[*] Error al guardar archivo, por favor comunicarse con sistemas"
                    );
                    return;
                  }
                }
              );
            } else {
              alert(
                "::ERROR:\n[*] Error al subir archivo, por favor comunicarse con sistemas"
              );
              return;
            }
          },
        });
      }
      listarDetalleSolicitud(docentry);
      alert("::MENSAJE:\n[*] Archivos guardados");
    }
  } else {
    alert("::ERROR:\n[*] Debes subir al menos un archivo");
  }
}

function sendNotificationSolicitudTraslado(
  solicitud,
  sede,
  usuario,
  origen,
  destino,
  modalidad,
  guia
) {
  $.post(
    "../../controllers/UsuarioController.php",
    {
      task: 4,
    },
    function (response) {
      let rpta = $.parseJSON(response);
      rpta.forEach((data) => {
        sendPushNotificationSolicitudTraslado(data.tokenfcm, solicitud, sede);
        sendMailNotificationSolicitudTraslado(
          data.correo,
          solicitud,
          sede,
          usuario,
          origen,
          destino,
          modalidad,
          guia
        );
      });
    }
  );
}

function sendPushNotificationSolicitudTraslado(token, solicitud, sede) {
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
        title: "Solicitud de traslado procesada",
        body: `RECEPCIÓN DE MERCADERÍA POR TRANSFERENCIA ENTRE ALMACENES SEDE: ${sede} | SOLICITUD DE TRASLADO ${solicitud}`,
      },
    }),
  };

  $.ajax(settings).done(function () {});
}

function sendMailNotificationSolicitudTraslado(
  correo,
  solicitud,
  sede,
  usuario,
  origen,
  destino,
  modalidad,
  guia
) {
  $.post(
    "../../controllers/SolicitudTrasladoController.php",
    {
      task: 7,
      body: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>PRUEBA - RECEPCIÓN DE MERCADERÍA POR TRANSFERENCIA ENTRE ALMACENES SEDE: ${sede} | SOLICITUD DE TRASLADO ${solicitud}</title>
        </head>
        <body>
          <div>
            <p>Usuario: <b>${usuario}</b></p>
            <p>N° Solicitud de traslado: <b>${solicitud}</b></p>
            <p>Almacén origen: <b>${origen}</b></p>
            <p>Almacén destino: <b>${destino}</b></p>
            <p>Modalidad: <b>${modalidad}</b></p>
            <p>N° Guía: <b>${guia}</b></p>
          </div>
        </body>
      </html>`,
      recipients: correo,
      subject: `PRUEBA - RECEPCIÓN DE MERCADERÍA POR TRANSFERENCIA ENTRE ALMACENES SEDE: ${sede} | SOLICITUD DE TRASLADO ${solicitud}`,
    },
    function () {}
  );
}
