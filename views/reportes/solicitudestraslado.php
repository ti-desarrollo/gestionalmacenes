<?php

date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-area'], ['SISTEMAS'])) {
?>
        <!-- Importamos el archivo js -->
        <script src="../../libs/js/funciones/reportes/solicitudTraslado.js"></script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">AUDITORÍA</a>
            </li>
            <li class="breadcrumb-item active">Reporte de solicitudes de traslado pendientes</li>
        </ol>

        <div class="container-fluid">
            <div class="row">
                <!-- Lista de solicitudes de traslado -->
                <div class="col-lg-12" id="dl">
                    <div class="card mt-3">
                        <div class="card-header">
                            <b>Lista de entradas de solicitudes de traslado</b>
                        </div>
                        <div class="card-body">
                            <div class="pull-right" style="padding-bottom: 10px;">
                                <form class="form-inline">
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
                                            <th>Documento SAP</th>
                                            <th>Guía</th>
                                            <th>Fecha</th>
                                            <th>Origen</th>
                                            <th>Destino</th>
                                            <th>Modalidad de traslado</th>
                                            <th>Transportista</th>
                                            <th>Peso total</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbdl">
                                        <tr>
                                            <td colspan="10"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            :: Para ver los productos que contiene la solicitud de traslado debes hacer clic en el número del documento <br />
                            :: La lista solo contiene las solicitudes de traslado que no han sido procesadas
                        </div>
                    </div>
                </div>

                <!-- Detalle de la entrada de mercancía -->
                <div class="col-lg-12" id="dd" style="display: none;">
                    <div class="card mt-3">
                        <div class="card-header">
                            <b>Datos de la solicitud de traslado</b>
                            <div class="pull-right">
                                <a href="#" id="closeDetalle">Ver lista</a>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="form-group row">
                                <div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                                    <label for="txtGuia">N° Guía GRR</label>
                                    <input type="text" class="form-control form-control-sm" id="txtGuia" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                                    <label for="txtNumDoc">N° Documento</label>
                                    <input type="text" class="form-control form-control-sm" id="txtNumDoc" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                                    <label for="txtFechaDoc">Fecha</label>
                                    <input type="text" class="form-control form-control-sm" id="txtFechaDoc" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-3">
                                    <label for="txtComentario">Comentarios</label>
                                    <input type="text" class="form-control form-control-sm" id="txtComentario" disabled>
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
                                            <th width="10%">Recibido</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbd"></tbody>
                                </table>
                            </div>
                        </div>
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
