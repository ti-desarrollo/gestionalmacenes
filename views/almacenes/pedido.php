<?php
date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'], $_SESSION['ga-idUsu'], $_SESSION['ga-sedeUsu'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-idPerfilUsu'], [1, 2, 3])) {
?>
        <script type="text/javascript">
            $(document).ready(
                function() {
                    listarPedidos();
                }
            );
        </script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">ALMACENES</a>
            </li>
            <li class="breadcrumb-item active">Pedidos</li>
        </ol>

        <div class="row">

            <!-- Lista de pedidos -->
            <div class="col-lg-12" id="divLista_Pedido">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Lista de pedidos</b>
                    </div>
                    <div class="card-body">
                        <div class="pull-right" style="padding-bottom: 10px;">
                            <form class="form-inline">
                                <div class="form-group">
                                    <input type="date" class="form-control" id="txtFechaInicio_Pedido" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <div class="form-group mx-2">
                                    <input type="date" class="form-control" id="txtFechaFin_Pedido" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <button type="button" class="btn btn-primary" id="btnReportar_Pedido" onclick="listarPedidos()">
                                    <i class="fa fa-play"></i> REPORTAR
                                </button>
                            </form>
                        </div>
                        <div class="table-responsive">
                            <table id="tListaPedidos_Pedido" class="table table-bordered table-striped">
                                <thead>
                                    <th>Código</th>
                                    <th>Estado</th>
                                    <th>N° Pedido</th>
                                    <th>Proveedor</th>
                                    <th>Fecha de entrega</th>
                                </thead>
                                <tbody id="tbodyListaPedidos_Pedido">
                                    <tr>
                                        <td colspan="5"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        :: La lista solo contiene los pedidos que pertenecen a la misma sede del usuario en sesión.<br>
                        :: Para ver los productos que contiene un pedido debes hacer clic en el número del documento.
                    </div>
                </div>
            </div>

            <!-- Detalle del pedido -->
            <div class="col-lg-12" id="divDetalle_Pedido" style="display: none;">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Datos del pedido</b>
                        <div class="pull-right">
                            <a href="#" onclick="listarPedidos()">Ver lista</a>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtGuia_Pedido">N° Guía</label>
                                <input type="text" class="form-control form-control-sm" id="txtGuia_Pedido">
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtNumDoc_Pedido">N° Documento</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumDoc_Pedido" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtFechaDoc_Pedido">Fecha</label>
                                <input type="text" class="form-control form-control-sm" id="txtFechaDoc_Pedido" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtEstado_Pedido">Estado</label>
                                <input type="text" class="form-control form-control-sm" id="txtEstado_Pedido" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="selConformidad_Pedido">Conformidad</label>
                                <select class="form-control form-control-sm" id="selConformidad_Pedido" onchange="habilitarComentariosPedido()">
                                    <option value="00" selected>Selecciona</option>
                                    <option value="01">Conforme</option>
                                    <option value="02">No conforme</option>
                                </select>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 col-xxl-2 mb-3">
                                <label for="txtComentario_Pedido">Comentarios</label>
                                <input type="text" class="form-control form-control-sm" id="txtComentario_Pedido" disabled>
                            </div>
                        </div>

                        <div class="table-responsive mb-3 mt-3">
                            <table id="tDetalle_Pedido" class="table table-bordered table-striped">
                                <thead>
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
                                <tbody id="tbodyDetalle_Pedido">
                                </tbody>
                            </table>
                        </div>
                        <div id="btnLayout_Pedido" class="text-center mb-3 mt-3"></div>
                        <div id="divArchivos_Pedido" class="text-center mb-3 mt-3"></div>
                        <div id="divLoading_Pedido" class="text-center" style="display: none;">
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
            <div class="modal fade" id="mdlLayout_Pedido" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document" style="max-width: unset; width: 50%;">
                    <div class="modal-content" style="padding: 20px; overflow-x: scroll;">
                        <div class="modal-header">
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">X</span></button>
                        </div>
                        <div class="modal-body">
                            <div id="layout_Pedido">

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
