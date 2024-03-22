<?php
date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-area'], ['RESPONSABLE DE ALMACEN', 'SISTEMAS'])) {
?>
        <!-- Importamos el archivo js -->
        <script src="../../libs/js/funciones/soldadura/pesajes.js"></script>
        <script src="../../libs/js/funciones/msjes.js"></script>

        <script type="text/javascript">
            let descripcion;
            let n_varilla = 0;
            //let codDescripcion = [];
            function mayus(e) {
            e.value = e.value.toUpperCase();    
            }
            $(document).ready(
                function() {
                    ListarPesajes();
                    ListarSobrantes();
                    kgTotal = 0;
                    kgTotalS = 0;
                    $("#btnNuevoRegistro").click(
                        function() {
                            $("#frmRegPesaje")[0].reset();
                            $("#tblDetalles").empty();
                            kgTotal = 0;
                            kgTotalS = 0;
                        }
                    );
                    
                    $('.mi-selector').select2();

                    $("#addFila").click(
                        function() {
                            if ($("#nmbKG").val() != 0 && $.trim($("#txtDescripcion").val()).length > 0) {
                                descripcion = $("#txtDescripcion").val();
                                kgTotal = kgTotal + parseFloat($("#nmbKG").val());
                                $("#tblDetalles").append("<tr>" +
                                    "<td style='vertical-align: middle;'><a href='#' class='delete'><i class='fa fa-remove'></i></a></td>" +
                                    "<td><input type='text' class='form-control form-control-sm' name='descripcionDetalle[]' value='" + $("#txtDescripcion").val() + "' readonly/></td>" +
                                    "<td><input type='number' style='text-align:right;' class='form-control form-control-sm KG' name='KG[]' value='" + $("#nmbKG").val() + "' readonly/></td>" +
                                    "</tr>");
                                $("#txtDescripcion").val("");
                                $("#nmbKG").val("");
                                $("#nmbKGTotal").val(kgTotal);

                                $(".delete").off().click(function(e) {
                                    subTotal = parseFloat($(this).parent("td").parent("tr").find(".KG").val());
                                    $(this).parent("td").parent("tr").remove();
                                    kgTotal = kgTotal - subTotal;
                                    $("#nmbKGTotal").val(kgTotal);
                                });
                            } else {
                                alert(":: Faltan datos en la línea de detalle a agregar.");
                            }
                        }
                    );

                    $("#addFilaS").click(
                        function() {
                            if ($("#nmbKGS").val() != 0 && $.trim($("#txtDescripcionS").val()).length > 0) {
                                descripcion2 = $("#txtDescripcionS").val();
                                kgTotalS = kgTotalS + parseFloat($("#nmbKGS").val());
                                $("#tblDetallesS").append("<tr>" +
                                    "<td style='vertical-align: middle;'><a href='#' class='delete'><i class='fa fa-remove'></i></a></td>" +
                                    "<td><input type='text' class='form-control form-control-sm' name='descripcionS[]' value='" + $("#txtDescripcionS").val() + "' readonly/></td>" +
                                    "<td><input type='number' style='text-align:right;' class='form-control form-control-sm KGS' name='KGS[]' value='" + $("#nmbKGS").val() + "' readonly/></td>" +
                                    "</tr>");
                                $("#txtDescripcionS").val("");
                                $("#nmbKGS").val("");
                                $("#nmbKGTotalS").val(kgTotalS);

                                $(".delete").off().click(function(e) {
                                    subTotalS = parseFloat($(this).parent("td").parent("tr").find(".KGS").val());
                                    $(this).parent("td").parent("tr").remove();
                                    kgTotalS = kgTotalS - subTotalS;
                                    $("#nmbKGTotalS").val(kgTotalS);
                                });
                            } else {
                                alert(":: Faltan datos en la línea de detalle a agregar.");
                            }
                        }
                    );
                }
            );
        </script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">SOLDADURA</a>
            </li>
            <li class="breadcrumb-item active">Pesajes</li>
        </ol>

        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-6">
                    <div class="card bg-light mb-3">
                        <div class="card-header"><i class="fa fa-file-o"></i> FORMULARIO DE REGISTRO - <b>Área: Almacén</b></div>
                        <div class="card-body">
                            <form action="" id="frmRegPesaje">
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label">Fecha de Pesaje:</label>
                                    <div class="col-sm-8">
                                        <input type="date" class="form-control form-control-sm" id="txtFecha" name="txtFecha" title="" value="<?php echo date('Y-m-d'); ?>">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label">Seleccione Item:</label>
                                    <div class="col-sm-8">
                                        <select class="form-control mi-selector form-control-sm" id="cboItem" onchange="selectNit(event)" name="cboItem" title="Seleccione Item">
                                            <option selected value="0">Seleccionar</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label">Empaque:</label>
                                    <div class="col-sm-8">
                                        <select class="form-control form-control-sm" id="cboEmpaque" name="cboEmpaque" title="Seleccione Tipo de Empaque">
                                            <option value="0">Selecciona</option>
                                            <option value="1">CAJA</option>
                                            <option value="2">LATA</option>
                                        </select>
                                    </div>
                                </div>
                                <!-- <form action="" id="frmAdjunto">
                                    <div class="form-group row">
                                        <div class="col-sm-4 col-md-4">
                                            <label for="archivo[]" class="control-label">Archivos</label>
                                        </div>
                                        <div class="col-sm-8">
                                            <input type="file" class="form-control form-control-sm" id="archivo[]" name="archivo[]" multiple="">
                                        </div>			
                                    </div>
                                </form> -->
                                <div class="form-group row">
                                    <div class="col-sm-4 col-md-4">
							            <label for="archivo[]" class="control-label">Archivos</label>
                                    </div>
							        <div class="col-sm-8">
								        <input type="file" class="form-control form-control-sm" id="archivo[]" name="archivo[]" multiple="">
							        </div>			
		        				</div>
                                <!-- <div class="form-group row">
                                    <div class="col-sm-4 col-md-4">
                                        <label for="mdlRegFile01">Evidencia:</label>
                                    </div>
                                    <div class="col-sm-8">
                                        <input class="form-control form-control-sm" id="mdlRegFile01" name="mdlRegFile01" type="file" accept="application/pdf">
                                    </div>
                                </div> -->
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label">Cantidad Soldadura:</label>
                                    <div class="col-sm-8">
                                        <!-- <input onkeyup="buscar();" type="number" class="form-control form-control-sm" id="txtCantidad" name="txtCantidad" title="Selecione la cantidad" value=""> -->
                                        <input onkeyup="buscar(this.value);" type="number" class="form-control form-control-sm" id="txtCantidad" name="txtCantidad" title="Selecione la cantidad" value="0">
                                    </div>
                                </div>
                                <label><b><u>Agregar detalles:</u></b></label>
                                <div class="form-group row">
                                    <div class="col-sm-4">
                                        <input type="number" class="form-control form-control-sm" id="nmbKG" min="0" placeholder="KG (1.00)">
                                    </div>
                                    <div class="col-sm-6">
                                        <input type="text" class="form-control form-control-sm" id="txtDescripcion" placeholder="Descripción (evitar apóstrofes)" disabled>
                                    </div>
                                    <div class="col-sm-2" align="right">
                                        <button type="button" class="btn btn-sm btn-outline-primary" id="addFila"><i class="fa fa-plus"></i> Agregar</button>
                                    </div>
                                </div>
                                <label><b><u>Detalles:</u></b></label>
                                <table class="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th><i class="fa fa-cog"></i></th>
                                            <th>Descripción</th>
                                            <th width="30%">KG</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <th colspan="2" style="vertical-align: middle;">KG total:</th>
                                            <th><input type="number" style="text-align:right;" class="form-control form-control-sm" id="nmbKGTotal" name="nmbKGTotal" title="" readonly></th>
                                        </tr>
                                    </tfoot>
                                    <tbody id="tblDetalles"></tbody>
                                </table>
                                <div class="text-right">
                                    <button class="btn btn-primary btn-sm" type="button" onclick="registrarPesaje()">
                                        <!-- <button class="btn btn-primary btn-sm" type="button" onclick="registrar()"> -->
                                        <i class="fa fa-save"></i> Registrar Pesaje
                                    </button>
                                </div>
                            </form>
                            <br>
                            <div class="border d-sm-none d-md-block" style="width: 100%;"></div>
                            <br>
                            <form action="" id="frmRegSobrantePesaje">
                                <h3>Varillas Sobrantes</h3>
                                <hr>
                                <div class="form-group row">
                                    <div class="col-sm-4 col-md-4">
							            <label for="mdlRegFile02" class="control-label">Archivos</label>
                                    </div>
							        <div class="col-sm-8">
								        <input type="file" class="form-control form-control-sm" id="mdlRegFile02" name="amdlRegFile02" multiple="">
							        </div>			
		        				</div>
                                <!-- <div class="form-group row">
                                    <div class="col-sm-4 col-md-4">
                                        <label for="mdlRegFile02">Evidencia:</label>
                                    </div>
                                    <div class="col-sm-8">
                                        <input class="form-control form-control-sm" id="mdlRegFile02" name="mdlRegFile02" type="file" accept="application/pdf">
                                    </div>
                                </div> -->
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label">Cantidad Sobrante:</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control form-control-sm" id="txtCantidadSobrante" name="txtCantidadSobrante" title="" value="0">
                                    </div>
                                </div>
                                <label><b><u>Agregar sobrante:</u></b></label>
                                <div class="form-group row">
                                    <div class="col-sm-4">
                                        <input type="number" class="form-control form-control-sm" id="nmbKGS" min="0" placeholder="KG (1.00)">
                                    </div>
                                    <div class="col-sm-6">
                                        <input type="text" class="form-control form-control-sm" id="txtDescripcionS" placeholder="Descripción (evitar apóstrofes)" onkeyup="mayus(this);">
                                    </div>
                                    <div class="col-sm-2" align="right">
                                        <button type="button" class="btn btn-sm btn-outline-primary" id="addFilaS"><i class="fa fa-plus"></i> Agregar</button>
                                    </div>
                                </div>
                                <label><b><u>Detalles Sobrante:</u></b></label>
                                <table class="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th><i class="fa fa-cog"></i></th>
                                            <th>Descripción</th>
                                            <th width="30%">KG</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <th colspan="2" style="vertical-align: middle;">KG total:</th>
                                            <th><input type="number" style="text-align:right;" class="form-control form-control-sm" id="nmbKGTotalS" name="nmbKGTotalS" title="" readonly></th>
                                        </tr>
                                    </tfoot>
                                    <tbody id="tblDetallesS"></tbody>
                                </table>
                                <div class="text-right">
                                    <button class="btn btn-primary btn-sm" type="button" onclick="registrarSobrante()">
                                        <i class="fa fa-save"></i> Registrar Sobrante
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div class="card-footer small text-muted">
                            <i class="fa fa-bell"></i> Ten en cuenta que DEBES registrar los sobrantes de la soldadura hasta completar un 1 KG.
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card bg-light mb-3">
                        <div class='short-div'>
                            <div class="card-header">
                                <i class="fa fa-file-archive-o"></i> REGISTROS DE PESAJES - <b>Área: Almacén</b>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive" id="divTabla"></div>
                            </div>
                            <div class="card-footer small text-muted">Los registros están ordenados de forma descendente por FECHA y ascendente por KG.</div>
                        </div>
                        <div class="border d-sm-none d-md-block" style="width: 100%;"></div>
                        <div class='short-div'>
                            <div class="card-header">
                                <i class="fa fa-file-archive-o"></i> REGISTROS DE VARILLAS SOBRANTES - <b>Área: Almacén</b>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive" id="divTabla2"></div>
                            </div>
                            <div class="card-footer small text-muted">Los registros están ordenados de forma descendente por FECHA y ascendente por KG.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Detalles de Pesajes Soldadura-->
        <div class="modal fade" id="mdlPesajeSoldadura" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="mdlHeader" style="font-size: 18px;">
                            <i class="fa fa-file-archive-o"></i> Detalles de Pesaje Soldadura - <b>Área: Almacén</b>
                        </h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">X</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group row">
                            <label for="" class="col-3 col-form-label">Fecha:</label>
                            <div class="col-9">
                                <input type="text" class="form-control form-control-sm" id="txtMdlFecha" title="" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="" class="col-3 col-form-label">Sede:</label>
                            <div class="col-9">
                                <input type="text" class="form-control form-control-sm" id="txtMdlSede" title="" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="" class="col-3 col-form-label">Cantidad Varillas:</label>
                            <div class="col-9">
                                <input type="text" class="form-control form-control-sm" id="txtMdlCantidad" title="" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="" class="col-3 col-form-label">Peso total:</label>
                            <div class="col-9">
                                <input type="text" class="form-control form-control-sm" id="txtMdlPesoTotal" title="" readonly>
                            </div>
                        </div>
                        <label for=""><b><u>Detalles</u></b></label>
                        <table class="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Descripción</th>
                                    <th>Empaque</th>
                                </tr>
                            </thead>
                            <tbody id="mdlTblDtsDetalles"></tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <a class="btn btn-secondary btn-sm" type="button" data-dismiss="modal">Cerrar</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Detalles de Pesajes Soldadura Sobrantes-->
        <div class="modal fade" id="mdlPesajeSoldaduraSobrante" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="mdlHeader2" style="font-size: 18px;">
                            <i class="fa fa-file-archive-o"></i> Detalles de Pesaje Soldadura Sobrante - <b>Área: Almacén</b>
                        </h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">X</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group row">
                            <label for="" class="col-3 col-form-label">Fecha:</label>
                            <div class="col-9">
                                <input type="text" class="form-control form-control-sm" id="txtMdlFechaS" title="" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="" class="col-3 col-form-label">Sede:</label>
                            <div class="col-9">
                                <input type="text" class="form-control form-control-sm" id="txtMdlSedeS" title="" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="" class="col-3 col-form-label">Cantidad Varillas:</label>
                            <div class="col-9">
                                <input type="text" class="form-control form-control-sm" id="txtMdlCantidadS" title="" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="" class="col-3 col-form-label">Peso total:</label>
                            <div class="col-9">
                                <input type="text" class="form-control form-control-sm" id="txtMdlPesoTotalS" title="" readonly>
                            </div>
                        </div>
                        <label for=""><b><u>Detalles</u></b></label>
                        <table class="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Descripción</th>
                                    <th>Peso Total</th>
                                </tr>
                            </thead>
                            <tbody id="mdlTblDtsDetallesS"></tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <a class="btn btn-secondary btn-sm" type="button" data-dismiss="modal">Cerrar</a>
                    </div>
                </div>
            </div>
        </div>
<?php
    } else {
        include('../no_autorizado.html');
    }
    include('../tmp_footer.html');
} else {
    header('Location: ../../login.php');
}
