<?php

date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'], $_SESSION['ga-idUsu'], $_SESSION['ga-sedeUsu'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-idPerfilUsu'], [1, 4])) {
?>
        <script type="text/javascript">
            $(document).ready(
                function() {
                    listarPedidosAdm();
                }
            );
        </script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">ADMINISTRATIVOS</a>
            </li>
            <li class="breadcrumb-item active">Pedidos</li>
        </ol>



        <div class="row">
            <!-- Lista de pedidos -->
            <div class="col-lg-12">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Lista de pedidos</b>
                    </div>
                    <div class="card-body">
                        <div class="pull-right" style="padding-bottom: 10px;">
                            <form class="form-inline">
                                <div class="form-group">
                                    <input type="date" class="form-control" id="txtFechaInicio_PedidoAdm" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <div class="form-group mx-2">
                                    <input type="date" class="form-control" id="txtFechaFin_PedidoAdm" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <button type="button" class="btn btn-primary" id="btnReportar_PedidoAdm" onclick="listarPedidosAdm()">
                                    <i class="fa fa-play"></i> REPORTAR
                                </button>
                            </form>
                        </div>
                        <div class="table-responsive">
                            <table id="tListaPedidos_PedidoAdm" class="table table-bordered table-striped">
                                <thead>
                                    <th>Estado</th>
                                    <th>Conformidad</th>
                                    <th>N° Pedido</th>
                                    <th>N° Guía</th>
                                    <th>Proveedor</th>
                                    <th>Fecha de entrega</th>
                                    <th>Fecha de recepción</th>
                                    <th>Sede</th>
                                    <th>Adjuntos</th>
                                </thead>
                                <tbody id="tbodyPedidos_PedidoAdm">
                                    <tr>
                                        <td colspan="9"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        :: La lista solo contiene los pedidos que han sido procesados
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
