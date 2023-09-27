<?php

date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'], $_SESSION['ga-idUsu'], $_SESSION['ga-sedeUsu'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-idPerfilUsu'], [1, 2, 3]) or in_array($_SESSION['ga-usuario'], ['amq-alm-02'])) {
?>
        <script type="text/javascript">
            $(document).ready(
                function() {
                    listarSolicitudes();
                }
            );
        </script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">ALMACENES</a>
            </li>
            <li class="breadcrumb-item active">Solicitudes de traslado</li>
        </ol>

        <div class="row">

            <!-- Lista de solicitudes -->
            <div class="col-lg-12" id="divLista_SolicitudTraslado">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Lista de solicitudes de traslado</b>
                    </div>
                    <div class="card-body">
                        <div class="pull-right" style="padding-bottom: 10px;">
                            <form class="form-inline">
                                <div class="form-group">
                                    <input type="date" class="form-control" id="txtFechaInicio_SolicitudTraslado" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <div class="form-group mx-2">
                                    <input type="date" class="form-control" id="txtFechaFin_SolicitudTraslado" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <button type="button" id="btnReportar_SolicitudTraslado" class="btn btn-primary" onclick="listarSolicitudes()">
                                    <i class="fa fa-play"></i> REPORTAR
                                </button>
                            </form>
                        </div>
                        <div class="table-responsive">
                            <table id="tListaSolicitudes_SolicitudTraslado" class="table table-bordered table-striped">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Código</th>
                                        <th>Nº Guía</th>
                                        <th>Fecha</th>
                                        <th>Origen</th>
                                        <th>Categoría de vehículo</th>
                                        <th>Modalidad de traslado</th>
                                        <th>Transportista</th>
                                        <th>Peso</th>
                                        <th>Estado</th>
                                        <th>Adjunto</th>
                                    </tr>
                                </thead>
                                <tbody id="tbodyLista_SolicitudTraslado">
                                    <tr>
                                        <td colspan="10"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        :: La lista solo contiene las solicitudes de traslado que pertenecen a la misma sede del usuario en sesión. <br>
                        :: Para ver los productos que contiene una solicitud hacer clic en el número del documento.
                    </div>
                </div>
            </div>

            <!-- Detalle de la solicitude -->
            <div class="col-lg-12" id="divDetalle_SolicitudTraslado" style="display: none;">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Datos de la solicitud de traslado</b>
                        <div class="pull-right">
                            <a href="#" onclick="listarSolicitudes()">Ver lista</a>
                        </div>
                    </div>
                    <div class="card-body">

                        <div class="form-group row">
                            <div class="form-group col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-1 col-xxl-1 mb-3">
                                <label for="txtNumGuia_SolicitudTraslado">N° Guía GRR</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumGuia_SolicitudTraslado" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-1 col-xxl-1 mb-3">
                                <label for="txtNumGuiaT_SolicitudTraslado">N° Guía GRT</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumGuiaT_SolicitudTraslado" autocomplete="off">
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtNumDoc_SolicitudTraslado">N° Documento</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumDoc_SolicitudTraslado" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtFechaDoc_SolicitudTraslado">Fecha</label>
                                <input type="text" class="form-control form-control-sm" id="txtFechaDoc_SolicitudTraslado" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtEstado_SolicitudTraslado">Estado</label>
                                <input type="text" class="form-control form-control-sm" id="txtEstado_SolicitudTraslado" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="selConformidad_SolicitudTraslado">Conformidad</label>
                                <select class="form-control form-control-sm" id="selConformidad_SolicitudTraslado" onchange="habilitarComentariosSolicitud()">
                                    <option value="00" selected>Selecciona</option>
                                    <option value="01">Conforme</option>
                                    <option value="02">No conforme</option>
                                </select>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtComentario_SolicitudTraslado">Comentarios</label>
                                <input type="text" class="form-control form-control-sm" id="txtComentario_SolicitudTraslado" disabled>
                            </div>
                        </div>

                        <div class="table-responsive" id="divTListaSolicitudes">
                            <table id="tDetalle_SolicitudTraslado" class="table table-bordered table-striped">
                                <thead class="thead-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Código</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th width="10%">Cantidad por Recepcionar</th>
                                    </tr>
                                </thead>
                                <tbody id="tbodyDetalle_SolicitudTraslado"></tbody>
                            </table>
                        </div>
                        <div id="btnProcesar_SolicitudTraslado"></div>
                        <div id="divArchivos_SolicitudTraslado" class="mt-3 mb-3"></div>
                    </div>
                    <div class="card-footer">
                        :: Verifica las cantidades antes de procesar la solicitud. <br>
                        :: Ten en cuenta que las solicitudes ya procesadas no pueden modificarse.
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
