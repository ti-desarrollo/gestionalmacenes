const maxFileSize = 5 * 1024 * 1024;
const controllerPE = "../../controllers/PedidoController.php";

let txtGuia;
let txtNumDoc;
let txtFechaDoc;
let txtEstado;
let selConformidad;
let txtComentario;

document.addEventListener("DOMContentLoaded", () => {
  // Obtenemos los campos
  txtGuia = document.getElementById("txtGuia");
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
    document.getElementById("di").style.display = "block";
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
  tbody.innerHTML = `<tr><td colspan="13"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';

  let fechaI = document.getElementById("txtFechaI").value;
  let fechaF = document.getElementById("txtFechaF").value;
  const task = 2;
  $.post(
    controllerPE,
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
          <tr id="row${element.codigo}" onclick="listarIngresos(${element.codigo})">
            <td class="text-primary" onclick="verDetalle(${element.codigo}, '${element.guia}')">${element.codigo}</td>
            <td>${element.estado}</td>
            <td>${element.pedido}</td>
            <td>${element.rucTransportista}</td>
            <td>${element.rzTransportista}</td>
            <td>${element.formaEnvio}</td>
            <td>${element.proveedor}</td>
            <td>${element.fechaEntrega}</td>
          </tr>`;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="13">Sin resultados</td></tr>`;
      }

      button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
    }
  );
}

function listarIngresos(pedido) {
  /**Agregar clase para saber que fila fue la que abrimos */
  rowSelected(pedido);
  const tbody = document.getElementById("tbi");
  const button = document.getElementById("btnR");
  tbody.innerHTML = `<tr><td colspan="8"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando';
  const task = 10;
  $.post(
    controllerPE,
    {
      task,
      pedido,
    },
    function (response) {
      const datos = JSON.parse(response);
      tbody.innerHTML = "";
      if (datos.length > 0) {
        datos.forEach((element, index) => {
          tbody.innerHTML += `
            <tr>
              <td>${index + 1}</td>
              <td><p style="background: ${element.estadoCabecera === "ACEPTADO" ? "#4CAF50" : "#f44336"}; color: white; border-radius: 10px; padding: 2px;">${element.estadoCabecera}</p></td>
              <td class="text-primary" onclick="verDetalleIngreso(${element.codigo}, '${element.guia}')">${element.codigo}</td>
              <td>${element.fecha}</td>
              <td>${element.conformidad}</td>
              <td>${element.guia}</td>
              <td>${element.estado}</td>
              <td>${element.comentario}</td>
            </tr>`;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="8">Sin resultados</td></tr>`;
      }

      button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
    }
  );
}

function verDetalleIngreso(pedido, guia) {
  $("#mdlIngreso").modal("toggle");  
  document.getElementById("sGuia").innerText = guia;
  const tbody = document.getElementById("tbdi");
  tbody.innerHTML = `<tr><td colspan="6"><i class="fa fa-spinner fa-2x fa-spin"></i></td></tr>`;
  const task = 11;
  $.post(
    controllerPE,
    {
      task,
      pedido,
    },
    function (response) {
      const datos = JSON.parse(response);
      tbody.innerHTML = "";
      if (datos.length > 0) {
        datos.forEach((element, index) => {
          tbody.innerHTML += `
            <tr>
              <td>${index + 1}</td>
              <td>${element.item}</td>
              <td>${element.descripcion}</td>
              <td>${element.cantidadPedida}</td>
              <td>${element.cantidadRecibida}</td>
              <td>${element.cantidadPendiente}</td>
            </tr>`;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="6">Sin resultados</td></tr>`;
      }

      button.innerHTML = '<i class="fa fa-play"></i> REPORTAR';
    }
  );
}

function verDetalle(docentry, guia) {
  /**Agregar clase para saber que fila fue la que abrimos */
  rowSelected(docentry);

  const task = 3;
  const divArchivos = document.getElementById("divArchivos");
  const btnLayout = document.getElementById("btnLayout");
  const tbody = document.getElementById("tbd");
  tbody.innerHTML = "";
  document.getElementById("dl").style.display = "none";
  document.getElementById("di").style.display = "none";
  document.getElementById("dd").style.display = "block";

  $.post(controllerPE, { task, docentry, guia }, function (response) {
    const datos = JSON.parse(response);
    txtGuia.value = datos[0].guia;
    txtNumDoc.value = datos[0].documento;
    txtFechaDoc.value = datos[0].fecha;
    txtEstado.value = datos[0].estado;
    selConformidad.value = datos[0].conformidad;
    txtComentario.value = datos[0].observacion;
    btnLayout.innerHTML = `<button type="button" class="btn btn-primary btn-sm" onclick='layout(${docentry});'><i class="fa fa-fw fa-eye"></i> Ver layout</button>`;
    if (datos[0].estado === "RECEPCIONADO") {
      divArchivos.innerHTML = "";
      selConformidad.disabled = true;
      txtGuia.disabled = true;
    } else {
      divArchivos.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center;">
          <input allowClear type="file" id="inputFile" accept="image/jpeg,image/jpg,image/png,application/pdf" multiple style="font-size: 10px; margin: 5px;" />
          <button type="button" class="btn btn-success btn-sm" onclick='procesar(${JSON.stringify(
            datos
          )});'><i class="fa fa-fw fa-upload"></i> Procesar pedido</button>
        </div>`;
      selConformidad.disabled = false;
      txtGuia.disabled = false;
      selConformidad.value = "00";
      txtGuia.value = "";
      txtComentario.value = "";
    }

    selConformidad.dispatchEvent(
      new Event("onchange", {
        bubbles: true,
        cancelable: true,
      })
    );

    datos.forEach((element, index) => {
      tbody.innerHTML += `
      <tr>
          <td style="vertical-align: middle">${index + 1}</td>
          <td style="vertical-align: middle">${element.item}</td>
          <td style="vertical-align: middle">${element.descripcion}</td>
          <td style="vertical-align: middle">${element.um}</td>
          <td style="vertical-align: middle" class="inputQPedida">${
            element.cantidadPedida
          }</td>
          <td style="vertical-align: middle" class="inputQRecibida">${
            element.cantidadRecibida
          }</td>
          <td style="vertical-align: middle">
            <input class="inputQRecepcionada" id="txtCantidadRecepcionada_${
              element.item
            }" type="number" 
              value="${parseFloat(element.cantidadRecepcionada)}" ${
        parseFloat(element.cantidadRecepcionada) === 0 ? "disabled" : ""
      } />
          </td>
      </tr>
      `;
    });
  });
}

function layout(docentry) {
  const divLayout = document.getElementById("layout");
  const task = 6;
  $.post(controllerPE, { task, docentry }, function (response) {
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
    `Fecha: ${
      data[0]["NAT-SOLICITANTE-FECHA"]
        ? data[0]["NAT-SOLICITANTE-FECHA"].date.substring(0, 10)
        : "---"
    }`,
    100,
    height + 45,
    "center"
  );
  pdf.text(data[0]["NAT-ELABORADO"] ?? "---", 140, height + 40, "center");
  pdf.text(
    `Fecha: ${
      data[0]["NAT-ELABORADO-FECHA"]
        ? data[0]["NAT-ELABORADO-FECHA"].date.substring(0, 10)
        : "---"
    }`,
    140,
    height + 45,
    "center"
  );
  pdf.text(data[0]["NAT-APROBADO"] ?? "---", 180, height + 40, "center");
  pdf.text(
    `Fecha: ${
      data[0]["NAT-APROBADO-FECHA"]
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

async function procesar(pedido) {
  const docentry = pedido[0].codigo;
  const dir = `${pedido[0].sede}\\RECEPCIÓN DE MERCADERÍA - ALMACÉN\\${pedido[0].year}\\${pedido[0].mes}\\COMPRAS NACIONALES\\${pedido[0].proveedor}\\${pedido[0].fechaFormato}`;
  const guia = txtGuia.value;
  const comentarios = txtComentario.value.trim();
  const conformidad = selConformidad.value;
  const inputFile = document.getElementById("inputFile");
  const items = [];
  const itemsPedidos = [];
  const itemsRecibidos = [];
  let estado = "R";
  let continuar = true;
  let isName = false;
  let responsePedido;
  let responseFile;
  let cabecera;

  if (
    guia.split("-").length !== 3 ||
    guia.split("-")[0] !== "GRR" ||
    guia.split("-")[1].substring(0, 1) === "E" ||
    guia.split("-")[1].substring(1, 1) === "G"
  ) {
    alert("::MENSAJE:\n[*] El número de guía no es válido");
    return;
  }

  if (conformidad === "00") {
    alert("::MENSAJE:\n[*] Selecciona si está conforme o no conforme");
    return;
  }

  if (inputFile.files.length < 1) {
    alert("::MENSAJE:\n[*] Debes subir al menos un archivo");
    return;
  }

  // Validación de archivos
  for (let i = 0; i < inputFile.files.length; i++) {
    let size = inputFile.files[i].size;
    let fileName = inputFile.files[i].name;
    if (size > maxFileSize) {
      alert(
        `::ERROR:\n[*] El archivo ${inputFile.files[i].name} supera el tamaño permitido de ${maxFileSize}.`
      );
      continuar = false;
      break;
    }

    if (fileName.split(".")[0] === guia) {
      isName = true;
    }
  }

  if (!continuar) {
    return;
  }

  if (!isName) {
    alert(
      "::ERROR\n[*] El nombre de uno tus archivos debe ser el número de guía que ingresaste"
    );
    return;
  }

  if (
    confirm(
      "::CONFIRMACIÓN:\n[*] ¿Está seguro de procesar el pedido? Esta acción es irreversible"
    )
  ) {
    document.querySelectorAll("td.inputQPedida").forEach(function (item, _) {
      itemsPedidos.push(parseFloat(item.innerHTML ?? 0));
    });
    document.querySelectorAll("td.inputQRecibida").forEach(function (item, _) {
      itemsRecibidos.push(parseFloat(item.innerHTML ?? 0));
    });

    document
      .querySelectorAll("input.inputQRecepcionada")
      .forEach(function (item, index) {
        items.push({
          item: item.parentNode.parentNode.children.item(1).innerHTML,
          cantidadPendienteRecibida: parseFloat(
            item.value === "" ? 0 : item.value
          ),
          cantidadRecibida: parseFloat(itemsRecibidos[index]),
          cantidadPedida: parseFloat(itemsPedidos[index]),
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

    // Actualizamos el pedido
    responsePedido = await procesarPedido(
      items,
      guia,
      docentry,
      comentarios,
      conformidad,
      estado
    );

    if (responsePedido.success) {
      cabecera = responsePedido.data.cabecera;
      for (let i = 0; i < inputFile.files.length; i++) {
        responseFile = await uploadFile(cabecera, dir, inputFile.files[i]);
        if (!responseFile.success) {
          continuar = false;
          break;
        }
      }
      if (continuar) {
        sendNotification(
          pedido[0].documento,
          pedido[0].sede,
          responsePedido.data.usuario,
          pedido[0].proveedor,
          pedido[0].guia,
          conformidad
        );
        alert(responsePedido.message);
      } else {
        alert(responseFile.message);
        rollbackPedido(docentry, cabecera, items);
      }
    } else {
      alert(responsePedido.message);
    }
  }
}

async function procesarPedido(
  items,
  guia,
  codigo,
  comentarios,
  conformidad,
  estado
) {
  let responseProcess;
  const task = 4;
  await $.post(
    controllerPE,
    {
      task,
      items,
      guia,
      codigo,
      comentarios,
      conformidad,
      estado,
    },
    function (response) {
      responseProcess = JSON.parse(response);
    }
  );
  return responseProcess;
}

async function uploadFile(cabecera, dir, file) {
  let responseUpload;
  let formData = new FormData();
  formData.append("task", 5);
  formData.append("file", file);
  formData.append("dir", dir);
  formData.append("cabecera", cabecera);
  await $.ajax({
    url: controllerPE,
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

function sendNotification(pedido, sede, usuario, proveedor, guia, conformidad) {
  // const task = 4;
  // $.post(
  //   "../../controllers/UsuarioController.php",
  //   {
  //     task,
  //   },
  //   function (response) {
  //     const data = JSON.parse(response);
  //     data.forEach((element) => {
  //       pushNotification(element.tokenfcm, pedido, sede);
  //       mailNotification(
  //         element.correo,
  //         pedido,
  //         sede,
  //         usuario,
  //         proveedor,
  //         guia,
  //         conformidad
  //       );
  //     });
  //   }
  // );
}

function pushNotification(token, pedido, sede) {
  // $.ajax({
  //   url: "https://fcm.googleapis.com/fcm/send",
  //   method: "POST",
  //   timeout: 0,
  //   headers: {
  //     Authorization:
  //       "key=AAAAIZ8QssU:APA91bHG2bnhZ4b51Bwtg-aY_zo99lofkdaLex4zGm1sy_fmU3cSdGC9fUzBvdsCbl5LK1Uu97BvvrnoDNawSvXcgpjsf1lVzzz-uYOsTdVQSvhoEdvffKeI-9mecRmiYeCox6RVhNT1",
  //     "Content-Type": "application/json",
  //   },
  //   data: JSON.stringify({
  //     to: token,
  //     notification: {},
  //     data: {
  //       title: "Pedido procesado",
  //       body: `RECEPCIÓN DE MERCADERÍA SEDE: ${sede} | PEDIDO ${pedido}`,
  //     },
  //   }),
  // }).done(function () {});
}

function mailNotification(
  recipients,
  pedido,
  sede,
  usuario,
  proveedor,
  guia,
  conformidad
) {
  // const task = 7;
  // let subject = `PRUEBA - RECEPCIÓN DE MERCADERÍA SEDE: ${sede} | PEDIDO ${pedido}`;
  // let body = `<!DOCTYPE html>
  // <html lang="en">
  //   <head>
  //     <meta charset="UTF-8" />
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //     <title>PRUEBA - RECEPCIÓN DE MERCADERÍA SEDE: ${sede} | PEDIDO ${pedido}</title>
  //   </head>
  //   <body>
  //     <div>
  //       <p>Usuario: <b>${usuario}</b></p>
  //       <p>N° Pedido: <b>${pedido}</b></p>
  //       <p>Proveedor: <b>${proveedor}</b></p>
  //       <p>N° Guía: <b>${guia}</b></p>
  //       <p>Conformidad: <b>${
  //         conformidad === "01" ? "CONFORME" : "NO CONFORME"
  //       }</b></p>
  //     </div>
  //   </body>
  // </html>`;
  // $.post(
  //   controllerPE,
  //   {
  //     task,
  //     body,
  //     recipients,
  //     subject,
  //   },
  //   function (_) {}
  // );
}

function rollbackPedido(pedido, cabecera, items) {
  const task = 9;
  $.post(
    controllerPE,
    {
      task,
      pedido,
      cabecera,
      items,
    },
    function (_) {}
  );
}
