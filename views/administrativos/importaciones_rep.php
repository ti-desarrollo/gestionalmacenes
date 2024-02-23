<?php

date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-area'], ['LOGISTICA', 'SISTEMAS'])) {
?>
        <!-- Importamos el archivo js -->
        <script src="../../libs/js/funciones/administrativos/importaciones_rep.js"></script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">LOGISTICA</a>
            </li>
            <li class="breadcrumb-item">
                <a href="#">IMPORTACIONES</a>
            </li>
            <li class="breadcrumb-item active">Reporte</li>
        </ol>

        <div class="container-fluid">
            <div class="row">
                <!-- Lista de importaciones registradas -->
                <div class="col-lg-12" id="dl">
                    <div class="card mt-3">
                        <div class="card-header">
                            <b>Lista de pedidos</b>
                        </div>
                        <div class="card-body">
                            <div class="pull-right" style="padding-bottom: 10px;">
                                <form class="form-inline center-text">
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
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <label for="txtFilter">Buscar en tabla: &nbsp;</label>
                                            <input type="text" class="form-control" id="txtFilter">
                                        </div>
                                    </div>
                                </div>
                                <table class="table table-bordered table-striped">
                                    <thead class="table-dark">
                                        <th>Código</th>
                                        <th>Estado</th>
                                        <th>N° Pedido</th>
                                        <th>N° Operación</th>
                                        <th>Proveedor</th>
                                        <th>Sede</th>
                                        <th>Fecha de recepción</th>
                                        <th>GRR</th>
                                        <th>GRT</th>
                                        <th>N° TICKET</th>
                                        <th>Conformidad</th>
                                        <th>Acciones</th>
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
                            :: La lista solo contiene los pedidos que pertenecen a la misma sede del usuario en sesión<br />
                            :: Para ver los productos que contiene un pedido debes hacer clic en el número del documento<br />
                            :: Leyenda: Subir No Conformidad <i class="fa fa-fw fa-upload" style="color: #F44336; font-size: large;"></i>
                        </div>
                    </div>
                </div>

                <!-- Modal de detalle de la recepción -->
                <div class="modal fade" id="mdlLayout" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document" style="max-width: unset; width: 50%;">
                        <div class="modal-content" style="padding: 20px; overflow-x: scroll;">
                            <div class="modal-header">
                                <h5 class="modal-title">Detalle de la recepción</h5>
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">X</span></button>
                            </div>
                            <div class="modal-body">
                                <div id="layout">
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-12 col-lg-6 col-xl-6 col-xxl-6">
                                            <div class="card mb-3">
                                                <div class="card-header">
                                                    <b>Fecha</b>
                                                </div>
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-4">
                                                            <label for="txtOrden">Orden</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtOrden">
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-8 col-xl-8 col-xxl-8">
                                                            <label for="txtFechaRecepcion">Fecha/Hora</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtFechaRecepcion">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12 col-lg-6 col-xl-6 col-xxl-6">
                                            <div class="card mb-3">
                                                <div class="card-header">
                                                    <b>Guía de remisión transportista</b>
                                                </div>
                                                <div class="card-body">
                                                    <div class="input-group mb-2">
                                                        <input type="text" readonly class="form-control form-control-sm" id="txtGRT">
                                                        <div class="input-group-prepend">
                                                            <a target="_blank" class="input-group-text" id="txtGRTAdjunto" style="color: #4CAF50"><i class="fa fa-fw fa-download"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12 col-lg-6 col-xl-6 col-xxl-6">
                                            <div class="card mb-3">
                                                <div class="card-header">
                                                    <b>Guía de remisión remitente</b>
                                                </div>
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="mb-2 col-xs-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12">
                                                            <div class="input-group mb-2">
                                                                <input type="text" readonly class="form-control form-control-sm" id="txtGRR">
                                                                <div class="input-group-prepend">
                                                                    <a target="_blank" class="input-group-text" id="txtGRRAdjunto" style="color: #4CAF50"><i class="fa fa-fw fa-download"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-6 col-xl-6 col-xxl-6">
                                                            <label for="txtGRRBultos">N° Bultos</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtGRRBultos">
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-6 col-xl-6 col-xxl-6">
                                                            <label for="txtGRRPeso">Peso</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtGRRPeso">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12 col-lg-6 col-xl-6 col-xxl-6">
                                            <div class="card mb-3">
                                                <div class="card-header">
                                                    <b>Ticket de balanza</b>
                                                </div>
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="mb-2 col-xs-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12">
                                                            <div class="input-group mb-2">
                                                                <input type="text" readonly class="form-control form-control-sm" id="txtTicket">
                                                                <div class="input-group-prepend">
                                                                    <a target="_blank" class="input-group-text" id="txtTicketAdjunto" style="color: #4CAF50"><i class="fa fa-fw fa-download"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-6 col-xl-6 col-xxl-6">
                                                            <label for="txtTicketBultos">N° Bultos</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtTicketBultos">
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-6 col-xl-6 col-xxl-6">
                                                            <label for="txtTicketPeso">Peso</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtTicketPeso">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12">
                                            <div class="card mb-3">
                                                <div class="card-header">
                                                    <b>Datos de recepción</b>
                                                </div>
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-4">
                                                            <label for="txtPesoRecibido">Peso recibido</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtPesoRecibido">
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-4">
                                                            <label for="txtBultosRecibidos">Bultos recepcionados</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtBultosRecibidos">
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-4">
                                                            <label for="txtPlacaVehiculo">Placa del vehículo</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtPlacaVehiculo">
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-2 col-xl-2 col-xxl-2">
                                                            <label for="txtDua">N° DUA</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtDua">
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-2 col-xl-2 col-xxl-2">
                                                            <label for="txtOt">N° OT</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtOt">
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-8 col-xl-8 col-xxl-8">
                                                            <label for="txtAgenteAduana">Agente ADUANA</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtAgenteAduana">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12">
                                            <div class="card mb-3">
                                                <div class="card-header">
                                                    <b>Datos de conformidad</b>
                                                </div>
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-4">
                                                            <label for="txtConformidad">Conformidad</label>
                                                            <div class="input-group mb-2">
                                                                <input type="text" readonly class="form-control form-control-sm" id="txtConformidad">
                                                                <div class="input-group-prepend">
                                                                    <a target="_blank" class="input-group-text" id="txtAdjuntoNoConformidad" style="color: #4CAF50;"><i class="fa fa-fw fa-download"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-8 col-xl-8 col-xxl-8">
                                                            <label for="txtComentario">Comentario</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtComentario" />
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-6 col-xl-6 col-xxl-6" id="UsuarioNoCo">
                                                            <label for="txtUsuarioNoConformidad">Usuario</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtUsuarioNoConformidad">
                                                        </div>
                                                        <div class="mb-2 col-xs-12 col-sm-6 col-lg-6 col-xl-6 col-xxl-6" id="FechaNoCo">
                                                            <label for="txtFechaNoConformidad">Fecha</label>
                                                            <input type="text" readonly class="form-control form-control-sm" id="txtFechaNoConformidad">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal carga de no conformidad -->
                <div class="modal fade" id="mdlLayoutNoConformidad" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document" style="max-width: unset; width: 50%;">
                        <div class="modal-content" style="padding: 20px; overflow-x: scroll;">
                            <div class="modal-header">
                                <h5 class="modal-title">Subir archivo de no conformidad</h5>
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">X</span></button>
                            </div>
                            <div class="modal-body">
                                <form id="formNoConformidad">
                                    <div class="form-group">
                                        <label for="noConformidadAjunto">Archivo de no conformidad</label>
                                        <input type="file" class="form-control" aria-describedby="fileHelp" accept="image/jpeg,image/jpg,image/png,application/pdf" id="noConformidadAjunto" required />
                                        <small id="fileHelp" class="form-text text-muted">Puedes subir un archivo JPEG, JPG, PNG O PDF</small>
                                    </div>
                                    <button type="submit" class="btn btn-success btn-sm"><i class="fa fa-fw fa-upload"></i> Subir archivo</button>
                                </form>
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
