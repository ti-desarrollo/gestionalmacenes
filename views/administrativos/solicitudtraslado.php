<?php

date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'], $_SESSION['ga-idUsu'], $_SESSION['ga-sedeUsu'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-idPerfilUsu'], [1, 4, 6])) {
?>
        <script type="text/javascript">
            $(document).ready(
                function() {
                    listarSolicitudesAdm();
                }
            );
        </script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">ADMINISTRATIVOS</a>
            </li>
            <li class="breadcrumb-item active">Solicitudes de traslado</li>
        </ol>

        <div class="row">

            <!-- Lista de solicitudes -->
            <div class="col-lg-12" id="divLista_SolicitudTrasladoAdm">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Lista de solicitudes de traslado</b>
                    </div>
                    <div class="card-body">
                        <div class="pull-right" style="padding-bottom: 10px;">
                            <form class="form-inline">
                                <div class="form-group">
                                    <input type="date" class="form-control" id="txtFechaInicio_SolicitudTrasladoAdm" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <div class="form-group mx-2">
                                    <input type="date" class="form-control" id="txtFechaFin_SolicitudTrasladoAdm" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <button type="button" id="btnReportar_SolicitudTrasladoAdm" class="btn btn-primary" onclick="listarSolicitudesAdm()">
                                    <i class="fa fa-play"></i> REPORTAR
                                </button>
                            </form>
                        </div>
                        <div class="table-responsive">
                            <table id="tListaSolicitudes_SolicitudTrasladoAdm" class="table table-bordered table-striped">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Código</th>
                                        <th>Nº Guía</th>
                                        <th>Fecha</th>
                                        <th>Sede</th>
                                        <th>Usuario</th>
                                        <th>Origen</th>
                                        <th>Destino</th>
                                        <th>Categoría de vehículo</th>
                                        <th>Modalidad de traslado</th>
                                        <th>Transportista</th>
                                        <th>Peso</th>
                                        <th>Estado</th>
                                        <th>Adjunto</th>
                                    </tr>
                                </thead>
                                <tbody id="tbodyLista_SolicitudTrasladoAdm">
                                    <tr>
                                        <td colspan="13"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        :: La lista solo contiene las solicitudes de traslado que han sido procesadas
                    </div>
                </div>
            </div>

            <!-- Detalle de la solicitude -->
            <div class="col-lg-12" id="divDetalle_SolicitudTrasladoAdm" style="display: none;">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Datos de la solicitud de traslado</b>
                        <div class="pull-right">
                            <a href="#" onclick="listarSolicitudesAdm()">Ver lista</a>
                        </div>
                    </div>
                    <div class="card-body">

                        <div class="form-group row">
                            <div class="form-group col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-1 col-xxl-1 mb-3">
                                <label for="txtNumGuia_SolicitudTrasladoAdm">N° Guía R</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumGuia_SolicitudTrasladoAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-1 col-xxl-1 mb-3">
                                <label for="txtNumGuiaT_SolicitudTrasladoAdm">N° Guía T</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumGuiaT_SolicitudTrasladoAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtNumDoc_SolicitudTrasladoAdm">N° Documento</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumDoc_SolicitudTrasladoAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtFechaDoc_SolicitudTrasladoAdm">Fecha</label>
                                <input type="text" class="form-control form-control-sm" id="txtFechaDoc_SolicitudTrasladoAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtEstado_SolicitudTrasladoAdm">Estado</label>
                                <input type="text" class="form-control form-control-sm" id="txtEstado_SolicitudTrasladoAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtConformidad_SolicitudTrasladoAdm">Conformidad</label>
                                <input class="form-control form-control-sm" id="txtConformidad_SolicitudTrasladoAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtComentario_SolicitudTrasladoAdm">Comentarios</label>
                                <input type="text" class="form-control form-control-sm" id="txtComentario_SolicitudTrasladoAdm" disabled>
                            </div>
                        </div>

                        <div class="table-responsive" id="divTListaSolicitudes">
                            <table id="tDetalle_SolicitudTrasladoAdm" class="table table-bordered table-striped">
                                <thead class="thead-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Código</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th width="10%">Recibido</th>
                                    </tr>
                                </thead>
                                <tbody id="tbodyDetalle_SolicitudTrasladoAdm"></tbody>
                            </table>
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
