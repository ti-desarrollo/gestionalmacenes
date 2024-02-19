const controllerI = "../../controllers/ImportacionesController.php";

const campos = {
  grr: "GRR",
  grrAdjunto: "GRR (adjunto)",
  grrBultos: "GRR - Bultos",
  grrPeso: "GRR - Peso",
  grt: "GRT",
  grtAdjunto: "GRT (adjunto)",
  ticket: "TICKET",
  ticketAdjunto: "TICKET (adjunto)",
  ticketBultos: "TICKET - Bultos",
  ticketPeso: "TICKET - Peso",
  pesoRecepcionado: "Peso recepcionado",
  bultosRecepcionados: "Bultos recepcionados",
  placaVehiculo: "Placa del vehículo",
  conformidad: "Conformidad",
  comentario: "Comentario",
  dua: "DUA",
  ot: "OT",
  agenteAduana: "Agente ADUANA",
};

let divdl,
  divdd,
  divdrr,
  txtOperacion,
  txtFamilia,
  txtProveedor,
  txtEstado,
  txtBultosSAP,
  txtPesoSAP,
  txtBultosPendientes,
  txtPesoPendiente,
  txtDUA,
  txtOT,
  txtAgente,
  importacion;

document.addEventListener("DOMContentLoaded", () => {
  txtOperacion = document.getElementById("txtOperacion");
  txtFamilia = document.getElementById("txtFamilia");
  txtProveedor = document.getElementById("txtProveedor");
  txtEstado = document.getElementById("txtEstado");
  txtBultosSAP = document.getElementById("txtBultosSAP");
  txtPesoSAP = document.getElementById("txtPesoSAP");
  txtBultosPendientes = document.getElementById("txtBultosPendientes");
  txtPesoPendiente = document.getElementById("txtPesoPendiente");
  txtDUA = document.getElementById("txtDUA");
  txtOT = document.getElementById("txtOT");
  txtAgente = document.getElementById("txtAgente");
  divdl = document.getElementById("dl");
  divdd = document.getElementById("dd");
  divdrr = document.getElementById("drr");

  document.getElementById("txtFilter").onkeyup = function (e) {
    filterTable(e.target.value, document.getElementById("tbdl"));
  };

  document.getElementById("closeDetalle").onclick = () => {
    limpiarCampos();
    divdl.style.display = "block";
    divdd.style.display = "none";
  };

  document.getElementById("addLineaRecepcion").onclick = addLineaRecepcion;
  document.getElementById("btnR").onclick = listar;
  document.getElementById("validarDatos").onclick = validarDatos;

  listar();
});

function listar() {
  const tbody = document.getElementById("tbdl");
  const button = document.getElementById("btnR");
  tbody.innerHTML = `<tr><td colspan="13"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

  const fechaI = document.getElementById("txtFechaI").value;
  const fechaF = document.getElementById("txtFechaF").value;
  const task = 2;

  $.post(controllerI, { task, fechaI, fechaF }, function (response) {
    const datos = JSON.parse(response);
    tbody.innerHTML = "";

    if (datos.length > 0) {
      datos.forEach((element) => {
        tbody.innerHTML += `
          <tr id="row${element.codigo}" onclick="verDetalle(${element.codigo})">
            <td class="text-primary">${element.codigo}</td>
            <td>${element.estado}</td>
            <td>${element.pedido}</td>
            <td>${element.proveedor}</td>
            <td>${element.fechaEntrega}</td>
            <td>${element.nOperacion}</td>
          </tr>`;
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="6">Sin resultados</td></tr>`;
    }

    button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
  });
}

function verDetalle(docentry) {
  rowSelected(docentry);
  const task = 3;
  const tbody = document.getElementById("tbd");
  tbody.innerHTML = "";
  divdl.style.display = "none";
  divdd.style.display = "block";

  $.post(controllerI, { task, docentry }, function (response) {
    const datos = JSON.parse(response);

    if (datos.length === 0) {
      Swal.fire({
        icon: "error",
        title: "¡Uy!",
        text: "No se encontraron datos para el pedido, intenta nuevamente",
      }).then((result) => {
        if (result.isConfirmed) {
          divdl.style.display = "block";
          divdd.style.display = "none";
        }
      });
    }

    Object.keys(datos[0]).forEach((key) => {
      const input = document.getElementById(
        `txt${key.charAt(0).toUpperCase() + key.slice(1)}`
      );
      if (input) input.value = datos[0][key];
    });

    importacion = datos[0];
    buscarRecepcionesRegistradasPorImportacion(importacion.codigo);
  });
  addLineaRecepcion();
}

function buscarRecepcionesRegistradasPorImportacion(importacion) {
  const task = 5;
  const tbody = document.getElementById("tbdr");
  tbody.innerHTML = "";
  $.post(controllerI, { task, importacion }, function (response) {
    const datos = JSON.parse(response);
    let color = "";
    if (datos.length > 0) {
      divdrr.style.display = "block";
      datos.forEach((element) => {
        color = element.conformidad === "Conforme" ? "#28a745" : "#F44336";
        tbody.innerHTML += `
          <tr>
            <td>${element.orden}</td>           
            <td>${element.fecha}</td>
            <td>${element.grr}</td>
            <td>${element.grt}</td>
            <td>${element.ticket}</td>
            <td><b style="background: ${color}; padding: 5px; color: #ffffff; border-radius: 5px;">${element.conformidad}</b></td>
            <td>
              <i class="fa fa-fw fa-trash" style="color: #F44336; font-size: large; cursor: pointer;" onclick="deleteRecepcion(${element.codigo})"></i>
              <i class="fa fa-fw fa-eye" style="color: #2196f3; font-size: large; cursor: pointer;" onclick="readRecepcion(${element.codigo})"></i>
            </td>
          </tr>`;
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="7">Sin resultados</td></tr>`;
      divdrr.style.display = "none";
    }
  });
}

function readRecepcion(recepcion) {
  const task = 6;
  $.post(controllerI, { task, recepcion }, function (response) {
    const datos = JSON.parse(response);

    if (datos.length === 0) {
      Swal.fire({
        icon: "error",
        title: "¡Uy!",
        text: "No se encontraron datos de la recepción, intenta nuevamente",
      }).then((result) => {
        if (result.isConfirmed) {
          divdl.style.display = "block";
          divdd.style.display = "none";
        }
      });
    }
    Object.keys(datos[0]).forEach((key) => {
      const input = document.getElementById(
        `txt${key.charAt(0).toUpperCase() + key.slice(1)}`
      );
      if (input) input.value = datos[0][key];
    });

    const file1 = document.getElementById("txtGRTAdjunto");
    const file2 = document.getElementById("txtGRRAdjunto");
    const file3 = document.getElementById("txtTicketAdjunto");
    const file4 = document.getElementById("txtAdjuntoNoConformidad");
    const UsuarioNoCo = document.getElementById("UsuarioNoCo");
    const FechaNoCo = document.getElementById("FechaNoCo");

    file1.href = datos[0]["GRTAdjunto"];
    file2.href = datos[0]["GRRAdjunto"];
    file3.href = datos[0]["TicketAdjunto"];
    file4.href = datos[0]["AdjuntoNoConformidad"];

    if (datos[0]["AdjuntoNoConformidad"] === null) {
      file4.style.visibility = "hidden";
      UsuarioNoCo.style.display = "none";
      FechaNoCo.style.display = "none";
    } else {
      file4.style.visibility = "visible";
      UsuarioNoCo.style.display = "block";
      FechaNoCo.style.display = "block";
    }

    $("#mdlLayout").modal("toggle");
  });
}

function deleteRecepcion(recepcion) {
  Swal.fire({
    title: "¿Está seguro de eliminar este registro?",
    text: "Esta acción no se puede revertir",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, procesar",
    cancelButtonText: "No, cancelar",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      let result;

      const formData = new FormData();
      formData.append("recepcion", recepcion);
      formData.append("task", 7);
      await $.ajax({
        url: controllerI,
        dataType: "text",
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: "post",
        success: function (response) {
          result = JSON.parse(response);
        },
      });
      return result;
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = result.value;
      Swal.fire({
        icon: response.success ? "success" : "error",
        title: response.message,
      }).then((result) => {
        if (result.isConfirmed) {
          rowSelected(parseInt(response.data));
        }
      });

      if (response.success) {
        listar();
        verDetalle(response.data);
      }
    }
  });
}

function limpiarCampos() {
  Object.keys(importacion).forEach((key) => {
    const input = document.getElementById(
      `txt${key.charAt(0).toUpperCase() + key.slice(1)}`
    );
    if (input) input.value = "";
  });
  txtDUA.value = "";
  txtOT.value = "";
  txtAgente.value = "";
}

function addLineaRecepcion() {
  const tbody = document.getElementById("tbd");
  const id = tbody.children.length + 1;
  const newRow = document.createElement("tr");
  newRow.id = `recepcion_${id}`;

  newRow.innerHTML = `
    <td style="vertical-align: middle">${id}</td>
    <td><i class="fa fa-fw fa-trash" style="color: #F44336; font-size: large; cursor: pointer;" onclick="deleteLineaRecepcion(this)"></i></td>
    <td style="vertical-align: middle"><input type="text" id="grr_${id}" /></td>
    <td style="vertical-align: middle"><input type="file" accept="image/jpeg,image/jpg,image/png,application/pdf" id="grrAdjunto_${id}" /></td>
    <td style="vertical-align: middle"><input type="number" id="grrBultos_${id}" /></td>
    <td style="vertical-align: middle"><input type="number" id="grrPeso_${id}" /></td>
    <td style="vertical-align: middle"><input type="text" id="grt_${id}" /></td>
    <td style="vertical-align: middle"><input type="file" accept="image/jpeg,image/jpg,image/png,application/pdf" id="grtAdjunto_${id}" /></td>
    <td style="vertical-align: middle"><input type="text" id="ticket_${id}" /></td>
    <td style="vertical-align: middle"><input type="file" accept="image/jpeg,image/jpg,image/png,application/pdf" id="ticketAdjunto_${id}" /></td>
    <td style="vertical-align: middle"><input type="number" id="ticketBultos_${id}" /></td>
    <td style="vertical-align: middle"><input type="number" id="ticketPeso_${id}" /></td>
    <td style="vertical-align: middle"><input type="number" id="bultosRecepcionados_${id}" /></td>
    <td style="vertical-align: middle"><input type="number" id="pesoRecepcionado_${id}" /></td>
    <td style="vertical-align: middle"><input type="text" id="placaVehiculo_${id}" /></td>
    <td style="vertical-align: middle">
      <select id="conformidad_${id}" onchange="actualizarEstadoComentario(this)">
        <option value="00" selected disabled>Selecciona</option>
        <option value="01">Conforme</option>
        <option value="02">No conforme</option>
      </select>
    </td>
    <td style="vertical-align: middle"><input type="text" id="comentario_${id}" disabled /></td>
  `;

  tbody.appendChild(newRow);
  actualizarNumerosFilas();
}

function deleteLineaRecepcion(element) {
  Swal.fire({
    title: "¿Está seguro de eliminar la fila?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "No, cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const row = element.parentNode.parentNode;
      row.parentNode.removeChild(row);
      actualizarNumerosFilas();
    }
  });
}

function actualizarNumerosFilas() {
  const tbody = document.getElementById("tbd");
  const filas = tbody.getElementsByTagName("tr");
  for (let i = 0; i < filas.length; i++) {
    filas[i].firstElementChild.textContent = i + 1;
  }
}

function actualizarEstadoComentario(select) {
  const fila = select.parentNode.parentNode;
  const comentarioInput = fila.querySelector(`input[id^="comentario_"]`);
  comentarioInput.disabled = select.value !== "02";
}

function validarDatos() {
  const tbody = document.getElementById("tbd");
  const filas = tbody.getElementsByTagName("tr");

  if (filas.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "¡Uy!",
      text: "No hay datos para registrar",
    });
    return;
  }

  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
    const inputs = fila.getElementsByTagName("input");
    const select = fila.querySelector("select");
    const comentarioInput = fila.querySelector(`input[id^="comentario_"]`);
    const conformidad = select.value;
    const comentario = comentarioInput.value.trim();

    for (let j = 0; j < inputs.length; j++) {
      if (
        inputs[j].value.trim() === "" &&
        inputs[j].id.indexOf("comentario") === -1
      ) {
        const nombreCampo = obtenerNombreCampo(inputs[j].id);
        Swal.fire({
          icon: "warning",
          title: "¡Uy!",
          text: `Falta llenar el campo "${nombreCampo}" en la Fila #${i + 1}`,
        });
        return;
      }
    }

    if (conformidad === "00") {
      Swal.fire({
        icon: "warning",
        title: "¡Uy!",
        text: `Por favor selecciona una opción en la columna "Conformidad" en la Fila #${
          i + 1
        }`,
      });
      return;
    } else if (conformidad === "02" && comentario === "") {
      Swal.fire({
        icon: "warning",
        title: "¡Uy!",
        text: `Por favor ingresa el "Comentario" en la Fila #${i + 1}`,
      });
      return;
    }
  }

  if (txtDUA.value === "" || txtOT.value === "" || txtAgente.value === "") {
    const camposVacios = [];
    if (txtDUA.value === "") camposVacios.push("DUA");
    if (txtOT.value === "") camposVacios.push("OT");
    if (txtAgente.value === "") camposVacios.push("Agente ADUANA");
    Swal.fire({
      icon: "warning",
      title: "¡Uy!",
      text: `Falta llenar el/los campo(s): ${camposVacios.join(", ")}`,
    });
    return;
  }

  const datos = [];

  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
    const inputs = fila.getElementsByTagName("input");
    const select = fila.querySelector("select");
    const comentarioInput = fila.querySelector(`input[id^="comentario_"]`);
    const conformidad = select.value;
    const comentario = comentarioInput.value.trim();

    const dato = {
      grr: inputs[0].value.trim(),
      grrAdjunto: inputs[1].files[0],
      grrBultos: inputs[2].value.trim(),
      grrPeso: inputs[3].value.trim(),
      grt: inputs[4].value.trim(),
      grtAdjunto: inputs[5].files[0],
      ticket: inputs[6].value.trim(),
      ticketAdjunto: inputs[7].files[0],
      ticketBultos: inputs[8].value.trim(),
      ticketPeso: inputs[9].value.trim(),
      bultosRecepcionados: inputs[10].value.trim(),
      pesoRecepcionado: inputs[11].value.trim(),
      placaVehiculo: inputs[12].value.trim(),
      conformidad: conformidad,
      comentario: comentario,
      dua: txtDUA.value.trim(),
      ot: txtOT.value.trim(),
      agenteAduana: txtAgente.value.trim(),
    };
    datos.push(dato);
  }

  addRecepcion(datos);
}

function obtenerNombreCampo(id) {
  id = id.split("_")[0];
  const nombreCampo = campos[id] || id;
  return nombreCampo;
}

function addRecepcion(datos) {
  Swal.fire({
    title: "¿Está seguro de procesar los datos?",
    text: "Verifica las cantidades antes de procesar el pedido, ten en cuenta que los pedidos ya procesados no pueden modificarse",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, procesar",
    cancelButtonText: "No, cancelar",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      let result;
      const formData = new FormData();
      for (let i = 0; i < datos.length; i++) {
        const id = i + 1;
        formData.append(`grrAdjunto_${id}`, datos[i].grrAdjunto);
        formData.append(`grtAdjunto_${id}`, datos[i].grtAdjunto);
        formData.append(`ticketAdjunto_${id}`, datos[i].ticketAdjunto);
      }
      formData.append("importacion", JSON.stringify(importacion));
      formData.append("recepcion", JSON.stringify(datos));
      formData.append("task", 4);
      await $.ajax({
        url: controllerI,
        dataType: "text",
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: "post",
        success: function (response) {
          result = JSON.parse(response);
        },
      });

      return result;
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = result.value;
      Swal.fire({
        icon: response.success ? "success" : "error",
        title: response.message,
      }).then((result) => {
        if (result.isConfirmed) {
          rowSelected(parseInt(response.data));
        }
      });

      if (response.success) {
        verDetalle(response.data);
      }
    }
  });
}
