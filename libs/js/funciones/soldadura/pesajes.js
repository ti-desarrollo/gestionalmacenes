// ListarPesajes();
// ListarSobrantes();
let codDescripcion = [];
let codDescripcionS = [];
ListarItem();
var bandera = false;
var codigoSobrante;

var idNC = 0;

const controllerPE = "../../controllers/SoldaduraController.php";

function ListarPesajes() {
    $("#divTabla").empty();
    $("#divTabla").html("<table id='tblDts' class='table-bordered table-hover'>" +
          "<thead><tr><th>Id Pesaje</th><th>Sede</th><th>Cantidad</th><th>KG total</th><th>Fecha</th><th><i class='fa fa-gears'></i></th></tr></thead>" +
          "<tbody id='tblDtsDetalles'></tbody></table>");
    $.get("../../controllers/SoldaduraController.php", { task: 1 },
       function (response) {
          //console.log(response);
          datos = JSON.parse(response);
          // console.log(datos);
          $.each(datos, function (i) {
             $("#tblDtsDetalles").append("<tr>" +
                   "<td><a href='#' data-toggle='modal' data-target='#mdlPesajeSoldadura' onclick='ListarPesaje("+ datos[i].id +")'>"+datos[i].id.toString().padStart(3, '0')+"</a></td>" +
                   "<td>"+datos[i].descripcion+"</td>" +
                   "<td>"+datos[i].Cantidad+"</td>" +
                   "<td><b>"+datos[i].Peso+"</b></td>"+
                   "<td><b>"+datos[i].Fecha_Pesaje.date.slice(0, -16)+"</b></td>" +
                   "<td><button class='btn btn-danger btn-sm' onclick='eliminarPesaje("+datos[i].id+")'>Eliminar</button></td>" +
                   "</tr>");
          });
          $("#tblDts").DataTable({
            //  order: [[4, "desc"], [2, "asc"] ,[0, "desc"]],
             language: { url: "../../libs/datatables/dt_spanish.json" }
          });
       }
    );
 }

function ListarSobrantes() {
    $("#divTabla2").empty();
    $("#divTabla2").html("<table id='tblDts2' class='table-bordered table-hover'>" +
          "<thead><tr><th>Id Sobrante</th><th>Sede</th><th>Cantidad</th><th>KG total</th><th>Fecha</th><th><i class='fa fa-gears'></i></th></tr></thead>" +
          "<tbody id='tblDtsDetalles2'></tbody></table>");
    $.get("../../controllers/SoldaduraController.php", { task: 2 },
       function (response) {
         console.log(response);
          datos = JSON.parse(response);
          $.each(datos, function (i) {
             $("#tblDtsDetalles2").append("<tr>" +
                   "<td><a href='#' data-toggle='modal' data-target='#mdlPesajeSoldaduraSobrante' onclick='ListarSobrante("+ datos[i].id +")'>"+datos[i].id.toString().padStart(3, '0')+"</a></td>" +
                   "<td>"+datos[i].descripcion+"</td>" +
                   "<td>"+datos[i].Cantidad+"</td>" +
                   "<td><b>"+datos[i].Peso+"</b></td>" +
                   "<td><b>"+datos[i].Fecha_Pesaje.date.slice(0, -16)+"</b></td>" +
                   "<td><button class='btn btn-danger btn-sm' onclick='eliminarSobrante("+datos[i].id+")'>Eliminar</button></td>" +
                   "</tr>");
          });
          $("#tblDts2").DataTable({
            //  order: [[4, "desc"], [2, "asc"] ,[0, "desc"]],
             language: { url: "../../libs/datatables/dt_spanish.json" }
          });
       }
    );
 }

function registrarPesaje() {   
   let cantidad = $("#txtCantidad").val();
   var combo = document.getElementById("cboEmpaque");
   var empaque = combo.options[combo.selectedIndex].text;
   //let descripcionDetalle = $("#descripcionDetalle[]").val();
   const descripcionDetalle = document.getElementById("descripcionDetalle[]");
   console.log(descripcionDetalle);
   let peso = $("#nmbKGTotal").val();   
   let fecha = $("#txtFecha").val();

   //Variables para registro de archivo file - Evidencia Soldadura
   let cabecera;
   let carpeta;
   let dir = '';
   const inputFile = document.getElementById("mdlRegFile01");
   const inputFile2 = document.getElementById("archivo[]");
  //  console.log(inputFile2);

   if (cantidad <= 0 || cantidad === "") {
     alert("Ingresa una cantidad correcta (mayor a 0)");
     return;
   }
 
   let confirmacion = confirm(msjConfirmacion);
   if (confirmacion) {
     var data = new FormData($("#frmRegPesaje")[0]);
     data.append("task", 3);
     data.append("cantidad", cantidad);
     data.append("descripcion", descripcion);
     data.append("codDescripcion", codDescripcion);
     //data.append("descripcionDetalle", descripcion);
     data.append("peso", peso);
     data.append("empaque", empaque);
     data.append("txtFecha", fecha);
     
     $.ajax({
       data: data,
       dataType: "json",
       type: "post",
       url: "../../controllers/SoldaduraController.php",
       contentType: false,
       processData: false,
       success: function (response) {
         //console.log(response);
         if (response.data.cabecera > 0) {
          if (response.success) {
            cabecera = response.data.cabecera;
            carpeta = response.data.carpeta;
            var anio = new Date().getFullYear();
            var mes = (new Date().getMonth()+1).toString().padStart(2, '0');
            const hoy = new Date()
            var nombreMes = hoy.toLocaleString('es-ES', { month: 'long' });
            var f = new Date();
            var fecha = `${(f.getDate())}`.padStart(2,'0') + "-"+ `${(f.getMonth()+1)}`.padStart(2, '0')+ "-" +f.getFullYear();
            dir = `${carpeta}\\RECEPCIÓN DE SOLDADURA - ALMACÉN\\${anio}\\${mes + '. ' + nombreMes.toUpperCase()}\\KILEO SOLDADURA\\${fecha}`;
            console.log(dir);
            // for (let i = 0; i < inputFile.files.length; i++) {
            //   responseFile = uploadFile(cabecera, dir, inputFile.files[i]);
            //   console.log(responseFile);
            // }
            for (let i = 0; i < inputFile2.files.length; i++) {
              responseFile = uploadFiles(cabecera, dir, inputFile2.files[i]);
              console.log(responseFile);
              if (responseFile === undefined) {
                responseFile = "";
              }
            }
            alert(msjExito);
            $("#frmRegPesaje")[0].reset();
            //window.location.reload();
            ListarPesajes();
            return responseFile;
           }           
          //  alert(msjExito);
          //  $("#frmRegPesaje")[0].reset();
          //  window.location.reload();
         } else {
           alert(msjError);
           console.log(msjError);
         }
       },
       error: function (jqXHR, textStatus, errorThrown) {
         console.log(jqXHR);
         console.log(textStatus);
         console.log(errorThrown);
       },
     });
   }
 }

 function registrarSobrante() {   
   let cantidad = $("#txtCantidadSobrante").val();
   let peso = $("#nmbKGTotalS").val();   
   let fecha = new Date().toISOString().substring(0,10);

   //Variables para registro de archivo file - Evidencia Varillas Soldadura Sobrante
   let cabecera;
   let carpeta;
   let dir = '';
   const inputFile = document.getElementById("mdlRegFile02");

   if (cantidad <= 0 || cantidad === "") {
     alert("Ingresa una cantidad correcta (mayor a 0)");
     return;
   }
 
   let confirmacion = confirm(msjConfirmacion);
   if (confirmacion) {
     var data = new FormData($("#frmRegSobrantePesaje")[0]);
     data.append("task", 4);
     data.append("cantidad", cantidad);
     data.append("descripcion", descripcion2);
     data.append("codDescripcionS", codDescripcionS);
     data.append("peso", peso);
     data.append("fecha", fecha);
     
     $.ajax({
       data: data,
       dataType: "json",
       type: "post",
       url: "../../controllers/SoldaduraController.php",
       contentType: false,
       processData: false,
       success: function (response) {
         console.log(response);
         if (response.data.cabecera > 0) {
          if (response.success) {
            cabecera = response.data.cabecera;
            carpeta = response.data.carpeta;
            var anio = new Date().getFullYear();
            var mes = (new Date().getMonth()+1).toString().padStart(2, '0');
            const hoy = new Date()
            var nombreMes = hoy.toLocaleString('es-ES', { month: 'long' });
            var f = new Date();
            var fecha = `${(f.getDate())}`.padStart(2,'0') + "-"+ `${(f.getMonth()+1)}`.padStart(2, '0')+ "-" +f.getFullYear();
            dir = `${carpeta}\\RECEPCIÓN DE SOLDADURA - ALMACÉN\\${anio}\\${mes + '. ' + nombreMes.toUpperCase()}\\KILEO SOLDADURA SOBRANTE\\${fecha}`;
            console.log(dir);
            for (let i = 0; i < inputFile.files.length; i++) {
              responseFile = uploadFileSobrante(cabecera, dir, inputFile.files[i]);
              console.log(responseFile);
              if (responseFile === undefined) {
                responseFile = "";
              }
            }
            alert(msjExito);
            $("#frmRegSobrantePesaje")[0].reset();
            // window.location.reload();
            ListarSobrantes();
            return responseFile;
           }
          //  alert(msjExito);
          //  $("#frmRegSobrantePesaje")[0].reset();
          //  window.location.reload();s
         } else {
           alert(msjError);
           console.log(msjError);
         }
       },
       error: function (jqXHR, textStatus, errorThrown) {
         console.log(jqXHR);
         console.log(textStatus);
         console.log(errorThrown);
       },
     });
   }
 }

async function registrar(){
   const cantidad = $("#txtCantidad").val();
   var combo = document.getElementById("cboEmpaque");
   const empaque = combo.options[combo.selectedIndex].text;
   const peso = $("#nmbKGTotal").val();   
   const fecha = $("#txtFecha").val();
   Swal.fire({
      title: "¿Está seguro de registar el pesaje?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, registrar",
      cancelButtonText: "No, cancelar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        responsePesaje = await procesarPesaje(
         cantidad,
          descripcion,
          peso,
          empaque,
          fecha
        );
  
        return responsePesaje;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (result.value.success) {
          listar();
          verDetalle(docentry, guia);
        }
        Swal.fire({
          icon: result.value.success ? "success" : "error",
          title: result.value.message,
        });
      }
    });
} 

async function procesarPesaje(
   cantidad,
   descripcion,
   peso,
   empaque,
   fecha
 ) {
   let responsePesaje;
   const task = 6;
   await $.post(
     controllerPE,
     {
       task,
       cantidad,
       descripcion,
       peso,
       empaque,
       fecha,
     },
     function (response) {
      console.log(response)
      responsePesaje = JSON.parse(response);
     }
   );
   return responsePesaje;
 }

 function ListarPesaje(id){
   $.get("../../controllers/SoldaduraController.php", { task: 11, id: id },
         function (response) {
            console.log(response);
            datos = JSON.parse(response);
            //Asignar valores al modal
            $("#mdlHeader").html("<i class='fa fa-file-archive-o'></i> Detalles de pesaje: #00"+datos[0].id+" - <b>Área: Almacén</b>");
            $("#txtMdlFecha").val(datos[0].Fecha_Registro.date.slice(0, -7));
            $("#txtMdlSede").val(datos[0].descripcion);
            $("#txtMdlCantidad").val(datos[0].Cantidad);
            $("#txtMdlPesoTotal").val(datos[0].Peso);
            $("#mdlTblDtsDetalles").empty();
            var nrows = 0;
            $.each(datos, function (i) {
              nrows++;
               $("#mdlTblDtsDetalles").append("<tr><td>"+  nrows +"</td><td>"+datos[i].Descripcion+"</td><td>"+datos[i].Empaque+"</td></tr>");
            });
         }
   );
}

function eliminarPesaje(id_Pesaje){
   if( confirm(":: ¿Estás seguro de eliminar este registro de pesaje #00"+ id_Pesaje +"?") ){
      $.post("../../controllers/SoldaduraController.php", { task: 5, id: id_Pesaje },
         function (response) {
            bandera = $.parseJSON(response);
            if( bandera > 0 ){
               //alert(":: Eliminación exitosa.");
               alert(msjExito);
               ListarPesajes();
            }else{
               //alert(":: No se pudo eliminar.");
                alert(msjError);
            }
         }
      );
   }
}

function ListarSobrante(id_Sobrante){
   $.get("../../controllers/SoldaduraController.php", { task: 13, id: id_Sobrante },
         function (response) {
          console.log(response);
            datos = JSON.parse(response);
            //Asignar valores al modal
            $("#mdlHeader2").html("<i class='fa fa-file-archive-o'></i> Detalles de pesaje sobrante: #00"+datos[0].id+" - <b>Área: Almacén</b>");
            $("#txtMdlFechaS").val(datos[0].Fecha_Registro.date.slice(0, -7));
            $("#txtMdlSedeS").val(datos[0].descripcion);
            $("#txtMdlCantidadS").val(datos[0].Cantidad);
            $("#txtMdlPesoTotalS").val(datos[0].Peso);
            $("#mdlTblDtsDetallesS").empty();
            var nrows = 0;
            $.each(datos, function (i) {
              nrows++;
               $("#mdlTblDtsDetallesS").append("<tr><td>"+ nrows +"</td><td>"+datos[i].Descripcion+"</td><td>"+datos[i].Peso+"</td></tr>");
            });
         }
   );
}

function eliminarSobrante(id_Sobrante){
   if( confirm(":: ¿Estás seguro de eliminar este registro de pesaje sobrante #00"+ id_Sobrante +"?") ){
      $.post("../../controllers/SoldaduraController.php", { task: 12, id: id_Sobrante },
         function (response) {
            bandera = $.parseJSON(response);
            if( bandera > 0 ){
               //alert(":: Eliminación exitosa.");
               alert(msjExito);
               ListarSobrantes();
            }else{
               //alert(":: No se pudo eliminar.");
                alert(msjError);
            }
         }
      );
   }
}

function uploadFile(cabecera, dir, file) {
  let responseUpload;
  let formData = new FormData($("#frmRegPesaje")[0]);
  formData.append("task", 14);
  formData.append("file", file);
  formData.append("dir", dir);
  formData.append("cabecera", cabecera);
  $.ajax({
    url: controllerPE,
    dataType: "text",
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    type: "post",
    success: function (response) {
      console.log(response);
      responseUpload = JSON.parse(response);
    },
  });

  return responseUpload;
}

function uploadFiles(cabecera, dir, file) {
  let responseUpload;
  let formData = new FormData($("#frmRegPesaje")[0]);
  formData.append("task", 17);
  formData.append("archivo", file);
  formData.append("dir", dir);
  formData.append("cabecera", cabecera);
  $.ajax({
    url: controllerPE,
    dataType: "text",
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    type: "post",
    success: function (response) {
      console.log(response);
      responseUpload = JSON.parse(response);
    },
  });

  return responseUpload;
}

function uploadFileSobrante(cabecera, dir, file) {
  let responseUpload;
  let formData = new FormData($("#frmRegSobrantePesaje")[0]);
  formData.append("task", 15);
  formData.append("file", file);
  formData.append("dir", dir);
  formData.append("cabecera", cabecera);
  $.ajax({
    url: controllerPE,
    dataType: "text",
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    type: "post",
    success: function (response) {
      console.log(response);
      responseUpload = JSON.parse(response);
    },
  });

  return responseUpload;
}

function ListarItem(){
  $.get("../../controllers/SoldaduraController.php", { task: 18},
        function (response) {
         //console.log(response);
           datos = JSON.parse(response);
           console.log(datos);
           //Asignar valores al option del Select
           $.each(datos, function (i) {
            $("#cboItem").append(
              "<option data-nit='" + datos[i].ItemName +"'"+
                "data-varilla='" + datos[i].numero_varillas +"'"+
                "value=" + datos[i].ItemCode +
                ">" + datos[i].ItemCode +
                "</option>"
            );
            // var objeto = datos[i].ItemCode;
            // codDescripcion.push(objeto);
           });
        }
  );
}

function selectNit(e) {
  document.getElementById("txtDescripcionS").value = "";
  document.getElementById("txtCantidadSobrante").value = "0";
  var nit =  e.target.selectedOptions[0].getAttribute("data-nit");
  n_varilla =  e.target.selectedOptions[0].getAttribute("data-varilla");
  var objeto= e.target.selectedOptions[0].getAttribute("value");
  codDescripcion.push(objeto);
  codDescripcionS.push(objeto);
  // console.log(nit);
  document.getElementById("txtDescripcion").value = nit;
  document.getElementById("txtCantidad").value = n_varilla;
  codigoSobrante = nit;
}

function buscar(cantidad)
{
    document.getElementById("txtCantidad").value = cantidad;
    var cant = $("#txtCantidad").val();
    // console.log(cant);
    var total = cant - n_varilla;
    // console.log(total);
    $("#txtCantidadSobrante").val(total);

    var cantidadSobrante = $("#txtCantidadSobrante").val();
    if(cantidadSobrante != 0)
    {
      document.getElementById("txtDescripcionS").value = codigoSobrante;
    }
}

