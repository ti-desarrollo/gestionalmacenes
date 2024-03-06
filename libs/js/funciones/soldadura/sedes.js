/**
 * Created by krubioc on 06/02/2018.
 */
function jsListarSedes() {
    $.get(
      "../controladores/managerController.php",
      {
        controller: "Sede",
        task: 1,
      },
      function (response) {
        datos = $.parseJSON(response);
        $.each(datos, function (i) {
          $("#cboSedes").append(
            "<option value=" +
              datos[i].id_sede +
              ">" +
              datos[i].desc_sede +
              "</option>"
          );
        });
      }
    );
  }