<?php

date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-area'], ['RESPONSABLE DE ALMACEN', 'SISTEMAS'])) {
?>
        <!-- Importamos el archivo js -->
        <script src="../../libs/js/funciones/almacenes/importaciones_reg.js"></script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">ALMACENES</a>
            </li>
            <li class="breadcrumb-item">
                <a href="#">IMPORTACIONES</a>
            </li>
            <li class="breadcrumb-item active">Registro</li>
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
                                        <th>Proveedor</th>
                                        <th>Fecha de recepción</th>
                                        <th>N° Operación</th>
                                    </thead>
                                    <tbody id="tbdl">
                                        <tr>
                                            <td colspan="6"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            :: La lista solo contiene los pedidos que pertenecen a la misma sede del usuario en sesión<br>
                            :: Para ver los productos que contiene un pedido debes hacer clic en el número del documento
                        </div>
                    </div>
                </div>

                <!-- Detalle del pedido -->
                <div class="col-lg-12" id="dd" style="display: none;">
                    <!-- Importación -->
                    <div class="card mt-3">
                        <div class="card-header">
                            <b>Datos del pedido</b>
                            <div class="pull-right">
                                <a href="#" id="closeDetalle">Ver lista</a>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="form-group row">
                                <div class="form-group col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                                    <label for="txtProveedor">Proveedor</label>
                                    <input type="text" class="form-control form-control-sm" id="txtProveedor" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-2 col-lg-3 col-xl-1 col-xxl-1 mb-3">
                                    <label for="txtOperacion">OP</label>
                                    <input type="text" class="form-control form-control-sm" id="txtOperacion" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-2 col-lg-3 col-xl-2 col-xxl-2 mb-3">
                                    <label for="txtFamilia">Familia</label>
                                    <input type="text" class="form-control form-control-sm" id="txtFamilia" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-1 col-xxl-1 mb-3">
                                    <label for="txtDUA">DUA</label>
                                    <input type="text" class="form-control form-control-sm" id="txtDUA">
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-1 col-xxl-1 mb-3">
                                    <label for="txtOT">OT</label>
                                    <input type="text" class="form-control form-control-sm" id="txtOT">
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                    <label for="txtAgente">Agente ADUANA</label>
                                    <select class="form-control form-control-sm" name="txtAgente" id="txtAgente">
                                        <option value="San Remo">San Remo</option>
                                        <option value="Grupo Transoceanic">Grupo Transoceanic</option>
                                        <option value="LB Gayoso">LB Gayoso</option>
                                        <option value="Orbis">Orbis</option>
                                    </select>
                                </div>

                                <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-4 col-xxl-4 mb-3">
                                    <label for="txtEstado">Estado</label>
                                    <input type="text" class="form-control form-control-sm" id="txtEstado" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-2 col-xxl-2 mb-3">
                                    <label for="txtBultosSAP">Bultos SAP</label>
                                    <input type="text" class="form-control form-control-sm" id="txtBultosSAP" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-2 col-xxl-2 mb-3">
                                    <label for="txtPesoSAP">Peso SAP</label>
                                    <input type="text" class="form-control form-control-sm" id="txtPesoSAP" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-2 col-xxl-2 mb-3">
                                    <label for="txtBultosPendientes">Bultos pendientes</label>
                                    <input type="text" class="form-control form-control-sm" id="txtBultosPendientes" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-2 col-xxl-2 mb-3">
                                    <label for="txtPesoPendiente">Peso pendiente</label>
                                    <input type="text" class="form-control form-control-sm" id="txtPesoPendiente" disabled>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Nuevas recepciones -->
                    <div class="card mt-3">
                        <div class="card-header">
                            <b>Registrar recepción</b>
                            <div class="pull-right">
                                <a href="#" id="addLineaRecepcion">Agregar línea de recepción</a>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table table-bordered table-striped">
                                <thead class="table-dark">
                                    <th>#</th>
                                    <th>Acción</th>
                                    <th>GRR</th>
                                    <th>GRR (adjunto)</th>
                                    <th>GRR - Bultos</th>
                                    <th>GRR - Peso</th>
                                    <th>GRT</th>
                                    <th>GRT (adjunto)</th>
                                    <th>TICKET</th>
                                    <th>TICKET (adjunto)</th>
                                    <th>TICKET - Bultos</th>
                                    <th>TICKET - Peso</th>
                                    <th>Bultos recepcionados</th>
                                    <th>Peso recepcionado</th>
                                    <th>Placa del vehículo</th>
                                    <th>Conformidad</th>
                                    <th>Comentario</th>
                                </thead>
                                <tbody id="tbd">
                                    <tr>
                                        <td colspan="16"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="card-footer text-center">
                            <button type="button" class="btn btn-success btn-sm" id="validarDatos"><i class="fa fa-fw fa-upload"></i> Procesar</button>
                        </div>
                    </div>

                    <!-- Recepciones registradas -->
                    <div id="drr" style="display: none;">
                        <div class="card mb-3 mt-3">
                            <div class="card-header">
                                <b>Recepciones registradas</b>
                            </div>
                            <div class="card-body">
                                <table class="table table-bordered table-striped">
                                    <thead class="table-dark">
                                        <th>#</th>
                                        <th>Fecha de recepción</th>
                                        <th>GRR</th>
                                        <th>GRT</th>
                                        <th>TICKET</th>
                                        <th>Conformidad</th>
                                        <th>Acción</th>
                                    </thead>
                                    <tbody id="tbdr">
                                        <tr>
                                            <td colspan="7"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="card-footer">
                                :: La lista solo contiene los registros que pertenecen a la misma sede del usuario en sesión<br />
                                :: Leyenda: Ver detalle <i class="fa fa-fw fa-eye" style="color: #2196f3; font-size: large;"></i> Eliminar registro <i class="fa fa-fw fa-trash" style="color: #F44336; font-size: large;"></i>
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
                                                            <div class="mb-2 col-xs-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12">
                                                                <table class="table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th></th>
                                                                            <th>GRR</th>
                                                                            <th>TICKET</th>
                                                                            <th>RECEPCIÓN</th>
                                                                            <th>ESTADO</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="tbodyConformidad">

                                                                    </tbody>
                                                                </table>
                                                            </div>
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
