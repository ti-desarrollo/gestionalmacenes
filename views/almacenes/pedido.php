<?php
date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'], $_SESSION['ga-idUsu'], $_SESSION['ga-sedeUsu'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-idPerfilUsu'], [1, 2, 3]) or in_array($_SESSION['ga-usuario'], ['amq-alm-02'])) {
?>

        <!-- Importamos el archivo js -->
        <script src="../../libs/js/funciones/almacenes/pedido.js"></script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">ALMACENES</a>
            </li>
            <li class="breadcrumb-item active">Pedidos</li>
        </ol>

        <div class="container-fluid">
            <div class="row">

                <!-- Lista de pedidos -->
                <div class="col-lg-12" id="dl">
                    <div class="card mt-3">
                        <div class="card-header">
                            <b>Lista de pedidos</b>
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
                                        <th>RUC de transportista</th>
                                        <th>Nombre de transportista</th>
                                        <th>Forma de envío</th>
                                        <th>Proveedor</th>
                                        <th>Fecha de entrega</th>
                                    </thead>
                                    <tbody id="tbdl">
                                        <tr>
                                            <td colspan="8"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
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
                                <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                    <label for="txtGuia">N° Guía Remisión Remitente</label>
                                    <input type="text" class="form-control form-control-sm" id="txtGuia" autocomplete="off">
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                    <label for="txtNumDoc">N° Documento</label>
                                    <input type="text" class="form-control form-control-sm" id="txtNumDoc" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                    <label for="txtFechaDoc">Fecha</label>
                                    <input type="text" class="form-control form-control-sm" id="txtFechaDoc" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                    <label for="txtEstado">Estado</label>
                                    <input type="text" class="form-control form-control-sm" id="txtEstado" disabled>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                    <label for="selConformidad">Conformidad</label>
                                    <select class="form-control form-control-sm" id="selConformidad">
                                        <option value="00" selected disabled>Selecciona</option>
                                        <option value="01">Conforme</option>
                                        <option value="02">No conforme</option>
                                    </select>
                                </div>
                                <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                    <label for="txtComentario">Comentarios</label>
                                    <input type="text" class="form-control form-control-sm" id="txtComentario" disabled autocomplete="off">
                                </div>
                            </div>

                            <div class="table-responsive mb-3 mt-3">
                                <div id="btnLayout" class="text-left mb-3 mt-3"></div>
                                <table class="table table-bordered table-striped">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Código</th>
                                            <th>Descripción</th>
                                            <th>UM</th>
                                            <th>Cantidad pedida</th>
                                            <th>Cantidad recibida</th>
                                            <th>Cantidad pendiente de recepción</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbd">
                                    </tbody>
                                </table>
                            </div>

                            <div id="divArchivos" class="text-center mb-3 mt-3">
                            </div>
                            <div id="divLoading" class="text-center" style="display: none;">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <p>
                                :: Verifica las cantidades antes de procesar el pedido. <br>
                                :: Ten en cuenta que los pedidos ya procesados no pueden modificarse.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Modal de layout -->
                <div class="modal fade" id="mdlLayout" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document" style="max-width: unset; width: 50%;">
                        <div class="modal-content" style="padding: 20px; overflow-x: scroll;">
                            <div class="modal-header">
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">X</span></button>
                            </div>
                            <div class="modal-body">
                                <div id="layout">

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
