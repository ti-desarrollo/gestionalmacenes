<?php

date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'], $_SESSION['ga-idUsu'], $_SESSION['ga-sedeUsu'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-idPerfilUsu'], [1, 5, 6])) {
?>
        <!-- Importamos el archivo js -->
        <script src="../../libs/js/funciones/administrativos/transferenciaStock.js"></script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">MESA DE PARTES</a>
            </li>
            <li class="breadcrumb-item active">Transferencias de stock</li>
        </ol>

        <div class="container-fluid">
            <div class="row">

                <!-- Lista de transferencias -->
                <div class="col-lg-12" id="dl">
                    <div class="card mt-3">
                        <div class="card-header">
                            <b>Lista de transferencias de stock</b>
                        </div>
                        <div class="card-body">
                            <div class="pull-right" style="padding-bottom: 10px;">
                                <form class="form-inline">
                                    <div class="form-group mx-2">
                                        <label for="txtSearch">Buscar (Transferencia, Guía): &nbsp;</label>
                                        <input type="text" class="form-control" id="txtSearch" placeholder="">
                                    </div>
                                    <div class="form-group mx-2">
                                        <input type="date" class="form-control" id="txtFechaI" value="<?php echo date("Y-m-d") ?>">
                                    </div>
                                    <div class="form-group mx-2">
                                        <input type="date" class="form-control" id="txtFechaF" value="<?php echo date("Y-m-d") ?>">
                                    </div>
                                    <button type="button" class="btn btn-primary" id="btnR">
                                        <i class="fa fa-play"></i> REPORTAR
                                    </button>
                                </form>
                            </div>
                            <div class="table-responsive">
                                <div class="container row">
                                    <div id="divPag" class="col-xs-12"></div>
                                </div>
                                <div class="container row">
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <label for="txtFilter">Buscar en tabla: &nbsp;</label>
                                            <input type="text" class="form-control" id="txtFilter">
                                        </div>
                                    </div>
                                </div>

                                <table class="table table-bordered table-striped">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Código</th>
                                            <th>Transferencia</th>
                                            <th>Responsable</th>
                                            <th>Solicitante</th>
                                            <th>Nº Guía</th>
                                            <th>Solicitud</th>
                                            <th>Fecha</th>
                                            <th>Origen</th>
                                            <th>Categoría de vehículo</th>
                                            <th>Modalidad de traslado</th>
                                            <th>Transportista</th>
                                            <th>Adjuntos</th>
                                            <th>Nota de transferencia</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbdl">
                                        <tr>
                                            <td colspan="12"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            :: Para ver los productos que contiene una transferencia debes hacer clic en el número del documento
                        </div>
                    </div>
                </div>

                <!-- Detalle de la transferencia -->
                <div class="col-lg-12" id="dd" style="display: none;">
                    <div class="card mt-3">
                        <div class="card-header">
                            <b>Datos de la transferencia de stock</b>
                            <div class="pull-right">
                                <a href="#" id="closeDetalle">Ver lista</a>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="form-group row">
                                <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                    <label for="txtNumGuia">N° Guía</label>
                                    <input type="text" class="form-control form-control-sm" id="txtNumGuia" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                    <label for="txtNumDoc">N° Documento</label>
                                    <input type="text" class="form-control form-control-sm" id="txtNumDoc" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                    <label for="txtFechaDoc">Fecha</label>
                                    <input type="text" class="form-control form-control-sm" id="txtFechaDoc" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                    <label for="txtTipo">Tipo</label>
                                    <input type="text" class="form-control form-control-sm" id="txtTipo" disabled>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-bordered table-striped">
                                    <thead class="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Código</th>
                                            <th>Descripción</th>
                                            <th>Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbd"></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer"></div>
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
