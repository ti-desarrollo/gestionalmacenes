function listarSolicitudes() {
  $("#btnReportar_SolicitudTraslado").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando'
  );
  $("#divLista_SolicitudTraslado").show();
  $("#divDetalle_SolicitudTraslado").hide();

  $.get(
    "../../controllers/SolicitudTrasladoController.php",
    {
      task: 1,
      fechaI: $("#txtFechaInicio_SolicitudTraslado").val(),
      fechaF: $("#txtFechaFin_SolicitudTraslado").val(),
    },
    function (response) {
      $("#btnReportar_SolicitudTraslado").html('<i class="fa fa-play"></i> REPORTAR');
      let datos = JSON.parse(response);
      let table = $("#tListaSolicitudes_SolicitudTraslado");
      let tbody = $("#tbodyLista_SolicitudTraslado");
      tbody.empty();

      $.each(datos, function (i) {
        tbody.append(
          ` <tr>
              <td class="text-primary" onclick="listarDetalleSolicitud(${datos[i].docentry})">${datos[i].docentry}</td>
              <td>${datos[i].guia}</td>
              <td>${datos[i].fecha}</td>
              <td>${datos[i].origen}</td>
              <td>${datos[i].transportista}</td>
              <td>${datos[i].placa}</td>
              <td></td>
              <td>${datos[i].estado}</td>
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
  );
}

function listarDetalleSolicitud(docentry) {
  $("#divLista_SolicitudTraslado").hide();
  $("#divDetalle_SolicitudTraslado").show();

  $.get(
    "../../controllers/SolicitudTrasladoController.php",
    { task: 2, docentry: docentry },
    function (response) {
      let datos = JSON.parse(response);
      let table = $("#tDetalle_SolicitudTraslado");
      let tbody = $("#tbodyDetalle_SolicitudTraslado");
      tbody.empty();

      if (datos.length > 0) {
        $("#txtNumGuia_SolicitudTraslado").val(datos[0].guia);
        $("#txtNumDoc_SolicitudTraslado").val(datos[0].docnum);
        $("#txtFechaDoc_SolicitudTraslado").val(datos[0].fecha);
        $("#txtEstado_SolicitudTraslado").val(datos[0].estado);
        $("#txtComentario_SolicitudTraslado").val(datos[0].comentarios);
        $("#selConformidad_SolicitudTraslado").val(datos[0].conformidad);
        $("#selConformidad_SolicitudTraslado").change();

        if (datos[0].estado !== "Procesada") {
          $("#divArchivos_SolicitudTraslado").html(
            `<div style="display: flex; justify-content: center; align-items: center; border: 1px solid; padding: 10px; border-radius: 10px;"><input allowClear type="file" id="inputFileST" accept="application/pdf" multiple style="font-size: 10px; margin: 5px;" /><button type="button" class="btn btn-success btn-small" onclick="subirFilesSolicitudes(${datos[0].docentry});" style="font-size: 10px; margin: 5px;"><i class="fa fa-fw fa-upload"></i> Cargar archivos</button></div>`
          );
          $("#btnProcesar_SolicitudTraslado").html(
            `<div class="pull-right mt-3 mb-3 text-center" style="width: 100%"><button type="button" class="btn btn-sm btn-success" onclick="procesarSolicitud(${datos[0].docentry});">Procesar</button></div>`
          );
          $("#selConformidad_SolicitudTraslado").prop("disabled", false);
          $("#txtNumGuia_SolicitudTraslado").prop("disabled", false);
        } else {
          $("#divArchivos_SolicitudTraslado").html("");
          $("#btnProcesar_SolicitudTraslado").html("");
          $("#selConformidad_SolicitudTraslado").prop("disabled", true);
          $("#txtNumGuia_SolicitudTraslado").prop("disabled", true);
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

function habilitarComentarios() {
  let value = $("#selConformidad_SolicitudTraslado").val();
  if ($("#txtEstado_SolicitudTraslado").val() !== "RECEPCIONADO") {
    if (value === "01") {
      $("#txtComentario_SolicitudTraslado").prop("disabled", true);
    } else {
      $("#txtComentario_SolicitudTraslado").prop("disabled", false);
    }
  }
}

function procesarSolicitud(docentry) {
  if (
    confirm(
      "::MENSAJE:\n[*] Recuerda que las guías procesadas no pueden modificarse."
    )
  ) {
    let items = [];

    $("input.inputsNmb").each(function (i, item) {
      items[i] = [
        $(this).attr("id"),
        $(this).parents("tr").find("td").eq(1).text(),
        parseFloat(item.value),
      ];
    });

    $.post(
      "../../controllers/SolicitudTrasladoController.php",
      {
        task: 3,
        arrayItems: items,
        docentry: docentry,
        observacion: $.trim($("#txtComentario_SolicitudTraslado").val()),
        conformidad: $("#selConformidad_SolicitudTraslado").val(),
      },
      function (response) {
        let data = JSON.parse(response);
        if (data.valor === items.length) {
          listarSolicitudes();
        }
        alert(data.message);
      }
    );
  }
}

function subirFilesSolicitudes(docentry) {
  const maxFileSize = 2 * 1024 * 1024;
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
        $.ajax({
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
      alert("::MENSAJE:\n[*] Archivos guardados");
      listarSolicitudes();
    }
  } else {
    alert("::ERROR:\n[*] Debes subir al menos un archivo");
  }
}
