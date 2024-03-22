const maxFileSize = 5 * 1024 * 1024;
const controllerST = "../../controllers/SolicitudTrasladoController.php";

let txtGuia;
let txtGuiaT;
let txtNumDoc;
let txtFechaDoc;
let txtEstado;
let selConformidad;
let txtComentario;

document.addEventListener("DOMContentLoaded", () => {
  // Obtenemos los campos
  txtGuia = document.getElementById("txtGuia");
  txtGuiaT = document.getElementById("txtGuiaT");
  txtNumDoc = document.getElementById("txtNumDoc");
  txtFechaDoc = document.getElementById("txtFechaDoc");
  txtEstado = document.getElementById("txtEstado");
  selConformidad = document.getElementById("selConformidad");
  txtComentario = document.getElementById("txtComentario");

  // Configuramos el buscador
  document.getElementById("txtFilter").onkeyup = function (e) {
    filterTable(e.target.value, document.getElementById("tbdl"));
  };

  // Configuramos el botón de búsqueda
  document.getElementById("btnR").onclick = listar;

  // Abrir/Cerrar
  document.getElementById("closeDetalle").onclick = () => {
    document.getElementById("dl").style.display = "block";
    document.getElementById("dd").style.display = "none";
  };

  // Habilitar/Deshabilitar comentarios
  selConformidad.onchange = function () {
    let value = selConformidad.value;
    if (txtEstado.value !== "RECEPCIONADO") {
      if (value === "01") {
        txtComentario.disabled = true;
      } else {
        txtComentario.disabled = false;
        txtComentario.value = "";
      }
    }
  };

  // Traemos los datos
  listar();
});

function listar() {
  const tbody = document.getElementById("tbdl");
  const button = document.getElementById("btnR");
  tbody.innerHTML = `<tr><td colspan="10"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

  let fechaI = document.getElementById("txtFechaI").value;
  let fechaF = document.getElementById("txtFechaF").value;
  const task = 2;
  $.post(
    controllerST,
    {
      task,
      fechaI,
      fechaF,
    },
    function (response) {
      const datos = JSON.parse(response);
      tbody.innerHTML = "";
      if (datos.length > 0) {
        datos.forEach((element) => {
          tbody.innerHTML += `
            <tr id="row${element.docentry}">
              <td class="text-primary" onclick="verDetalle(${element.docentry})">${element.docentry}</td>
              <td>${element.guia}</td>
              <td>${element.fecha}</td>
              <td>${element.origen}</td>
              <td>${element.categoriaVehiculo}</td>
              <td>${element.modalidadTraslado}</td>
              <td>${element.transportista}</td>
              <td>${element.pesoTotal}</td>
              <td>${element.estado}</td>
              <td>${element.adjuntos}</td>
            </tr>`;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="10">Sin resultados</td></tr>`;
      }

      button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
    }
  );
}

function verDetalle(docentry) {
  /**Agregar clase para saber que fila fue la que abrimos */
  rowSelected(docentry);

  const task = 3;
  const divArchivos = document.getElementById("divArchivos");
  const tbody = document.getElementById("tbd");
  tbody.innerHTML = "";
  document.getElementById("dl").style.display = "none";
  document.getElementById("dd").style.display = "block";

  $.post(controllerST, { task, docentry }, function (response) {
    const datos = JSON.parse(response);

    txtGuia.value = datos[0].guia;
    txtGuiaT.value = datos[0].guiaT;
    txtNumDoc.value = datos[0].docnum;
    txtFechaDoc.value = datos[0].fecha;
    txtEstado.value = datos[0].estado;
    txtComentario.value = datos[0].comentarios;
    selConformidad.value = datos[0].conformidad;

    if (datos[0].estado === "PROCESADA") {
      divArchivos.innerHTML = "";
      selConformidad.disabled = true;
      txtGuiaT.disabled = true;
    } else {
      divArchivos.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center;">
          <input allowClear type="file" id="inputFile" accept="image/jpeg,image/jpg,image/png,application/pdf" multiple style="font-size: 10px; margin: 5px;" />
          <button type="button" class="btn btn-success btn-sm" onclick='procesar(${JSON.stringify(
            datos
          )});'><i class="fa fa-fw fa-upload"></i> Procesar solicitud</button>
        </div>`;
      selConformidad.disabled = false;
      txtGuiaT.disabled = false;
      selConformidad.value = "00";
      txtGuiaT.value = "";
      txtComentario.value = "";
    }

    selConformidad.dispatchEvent(
      new Event("onchange", {
        bubbles: true,
        cancelable: true,
      })
    );

    datos.forEach((element, index) => {
      tbody.innerHTML += `<tr>
            <td style="vertical-align: middle">${index + 1}</td>
            <td style="vertical-align: middle">${element.itemcode}</td>
            <td style="vertical-align: middle">${element.descripcion}</td>
            <td style="vertical-align: middle" class="inputQPedida">${
              element.cantidad
            }</td>
            <td>
              <input
                id="txtCantidad_${element.itemcode}"
                type="number" 
                class="form-control form-control-sm inputQRecibida" 
                value="${element.cantidadRecibida}" ${
        element.estado === "PROCESADA" ? "disabled" : ""
      }
                onkeyup="changeColor('${element.itemcode}', ${
        element.cantidad
      })"
              />
            </td>
            <td><div id="estado_items_${
              element.itemcode
            }" style="height: 10px; width: 10px; border-radius: 10px; background: #f44336; margin: auto;"></div></td>
      </tr>`;
    });
  });
}

async function procesar(solicitud) {
  const docentry = solicitud[0].docentry;
  const dir = `${solicitud[0].carpeta}\\RECEPCIÓN DE MERCADERÍA - ALMACÉN\\${solicitud[0].year}\\${solicitud[0].mes}\\TRANSFERENCIAS\\${solicitud[0].origen}\\${solicitud[0].fechaFormato}`;
  const guiaT = txtGuiaT.value;
  let isNameGuiaT = false;
  let isNameGuia = false;
  const comentarios = txtComentario.value.trim();
  const conformidad = selConformidad.value;
  const inputFile = document.getElementById("inputFile");
  const items = [];
  const itemsPedidos = [];
  let cantidad = 0;
  let continuar = true;
  let responseSolicitud;
  let responseFile;

  if (guiaT.length > 0) {
    if (
      guiaT.split("-").length !== 3 ||
      guiaT.split("-")[0] !== "GRT" ||
      guiaT.split("-")[1].substring(0, 1) === "T"
    ) {
      Swal.fire({
        icon: "error",
        title: "¡Uy!",
        text: "El número de guía no es válido",
      });
      return;
    }
  }

  if (conformidad === "00") {
    Swal.fire({
      icon: "error",
      title: "¡Uy!",
      text: "Selecciona si está conforme o no conforme",
    });
    return;
  }

  if (inputFile.files.length < 1) {
    Swal.fire({
      icon: "error",
      title: "¡Uy!",
      text: "Debes subir al menos un archivo",
    });
    return;
  }

  // Validación de archivos
  for (let i = 0; i < inputFile.files.length; i++) {
    let size = inputFile.files[i].size;
    let fileName = inputFile.files[i].name;

    if (size > maxFileSize) {
      Swal.fire({
        icon: "error",
        title: "¡Uy!",
        text: `El archivo ${inputFile.files[i].name} supera el tamaño permitido de ${maxFileSize}.`,
      });

      continuar = false;
      break;
    }

    if (fileName.split(".")[0] === txtGuia.value) {
      isNameGuia = true;
    }
    if (fileName.split(".")[0] === guiaT) {
      isNameGuiaT = true;
    }
  }

  if (!continuar) {
    return;
  }

  if (!isNameGuia) {
    Swal.fire({
      icon: "error",
      title: "¡Uy!",
      text: "El nombre de uno tus archivos debe ser el número de guía de remisión remitente",
    });
    return;
  }

  if (!isNameGuiaT && guiaT.length > 0) {
    Swal.fire({
      icon: "error",
      title: "¡Uy!",
      text: "El nombre de uno tus archivos debe ser el número de guía de remisión transportista",
    });
    return;
  }

  document.querySelectorAll("td.inputQPedida").forEach(function (item, _) {
    itemsPedidos.push(parseFloat(item.innerHTML ?? 0));
  });

  document
    .querySelectorAll("input.inputQRecibida")
    .forEach(function (item, index) {
      items.push({
        item: item.parentNode.parentNode.children.item(1).innerHTML,
        cantidadPedida: parseFloat(itemsPedidos[index]),
        cantidadRecibida: parseFloat(item.value === "" ? 0 : item.value),
      });
    });

  items.forEach((item, _) => {
    cantidad = cantidad + item.cantidadRecibida;
  });

  if (cantidad === 0) {
    Swal.fire({
      icon: "error",
      title: "¡Uy!",
      text: "Ingresa la cantidad que recibiste",
    });
    return;
  }

  Swal.fire({
    title: "¿Está seguro de procesar el la solicitud?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, procesar",
    cancelButtonText: "No, cancelar",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      responseSolicitud = await procesarSolicitud(
        docentry,
        guiaT,
        comentarios,
        conformidad,
        items
      );

      if (responseSolicitud.success) {
        for (let i = 0; i < inputFile.files.length; i++) {
          responseFile = await uploadFile(docentry, dir, inputFile.files[i]);
          if (!responseFile.success) {
            continuar = false;
            break;
          }
        }
        if (continuar) {
          sendNotification(
            solicitud[0].docnum,
            solicitud[0].sede,
            responseSolicitud.data.usuario,
            solicitud[0].origen,
            solicitud[0].sede,
            solicitud[0].modalidadTraslado,
            guiaT
          );
          return responseSolicitud;
        }
        return responseFile;
      }

      return responseSolicitud;
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then(async (result) => {
    if (result.isConfirmed) {
      if (result.value.success) {
        listar();
        verDetalle(docentry);
      }
      Swal.fire({
        icon: result.value.success ? "success" : "error",
        title: result.value.message,
      });
    }
  });
}

async function procesarSolicitud(
  docentry,
  guiaT,
  comentarios,
  conformidad,
  items
) {
  let responseSolicitud;
  const task = 4;
  await $.post(
    controllerST,
    {
      task,
      docentry,
      guiaT,
      comentarios,
      conformidad,
      items,
    },
    function (response) {
      responseSolicitud = JSON.parse(response);
    }
  );
  return responseSolicitud;
}

async function uploadFile(solicitud, dir, file) {
  let responseUpload;
  let formData = new FormData();
  formData.append("task", 5);
  formData.append("file", file);
  formData.append("dir", dir);
  formData.append("solicitud", solicitud);
  await $.ajax({
    url: controllerST,
    dataType: "text",
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    type: "post",
    success: function (response) {
      responseUpload = JSON.parse(response);
    },
  });

  return responseUpload;
}

function sendNotification(
  solicitud,
  sede,
  usuario,
  origen,
  destino,
  modalidad,
  guia
) {
  const task = 4;
  $.post(
    "../../controllers/UsuarioController.php",
    {
      task,
    },
    function (response) {
      const data = $.parseJSON(response);
      data.forEach((data) => {
        pushNotification(data.tokenfcm, solicitud, sede);
        mailNotification(
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

function pushNotification(token, solicitud, sede) {
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
        title: "Solicitud de traslado procesada",
        body: `RECEPCIÓN DE MERCADERÍA POR TRANSFERENCIA ENTRE ALMACENES SEDE: ${sede} | SOLICITUD DE TRASLADO ${solicitud}`,
      },
    }),
  }).done(function () {});
}

function mailNotification(
  recipients,
  solicitud,
  sede,
  usuario,
  origen,
  destino,
  modalidad,
  guia
) {
  const task = 6;
  const subject = `PRUEBA - RECEPCIÓN DE MERCADERÍA POR TRANSFERENCIA ENTRE ALMACENES SEDE: ${sede} | SOLICITUD DE TRASLADO ${solicitud}`;
  const body = `<!DOCTYPE html>
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
  </html>`;
  $.post(
    "../../controllers/SolicitudTrasladoController.php",
    {
      task,
      body,
      recipients,
      subject,
    },
    function () {}
  );
}

function changeColor(item, cantidadPendiente) {
  const estado = document.getElementById(`estado_items_${item}`);
  const cantidadRecibida = parseFloat(
    document.getElementById(`txtCantidad_${item}`).value || 0
  );
  let color = "#f44336";

  if (cantidadRecibida > cantidadPendiente) {
    color = "#ff9800";
  }
  if (cantidadRecibida === cantidadPendiente) {
    color = "#28a745";
  }
  if (cantidadRecibida < cantidadPendiente) {
    color = "#f44336";
  }
  estado.style.background = color;
}
