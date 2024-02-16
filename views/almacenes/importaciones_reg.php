<?php

date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-area'], ['ALMACENES', 'TIC', 'PLANEAMIENTO'])) {
?>
        <!-- Importamos el archivo js -->
        <script src="../../libs/js/funciones/almacenes/importaciones.js"></script>

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
                                        <th>Fecha de entrega</th>
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
                                    <input type="text" class="form-control form-control-sm" id="txtAgente">
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
                    <div class="card mt-3">
                        <div class="card-header">
                            <b>Recepción</b>
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
