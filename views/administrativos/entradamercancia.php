<?php

date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'], $_SESSION['ga-idUsu'], $_SESSION['ga-sedeUsu'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-idPerfilUsu'], [1, 5, 6])) {
?>
        <script type="text/javascript">
            $(document).ready(
                function() {
                    listarEntradaMercanciasAdm();
                }
            );
        </script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">MESA DE PARTES</a>
            </li>
            <li class="breadcrumb-item active">Entradas de mercancías</li>
        </ol>


        <div class="row">
            <!-- Lista de entradas de mercancías -->
            <div class="col-lg-12" id="divLista_EntradaMercanciaAdm">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Lista de entradas de mercancías</b>
                    </div>
                    <div class="card-body">
                        <div class="pull-right" style="padding-bottom: 10px;">
                            <form class="form-inline">
                                <div class="form-group">
                                    <input type="date" class="form-control" id="txtFechaInicio_EntradaMercanciaAdm" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <div class="form-group mx-2">
                                    <input type="date" class="form-control" id="txtFechaFin_EntradaMercanciaAdm" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <button type="button" class="btn btn-primary" id="btnReportar_EntradaMercanciaAdm" onclick="listarEntradaMercanciasAdm()">
                                    <i class="fa fa-play"></i> REPORTAR
                                </button>
                            </form>
                        </div>
                        <div class="table-responsive">
                            <table id="tListaEntradas_EntradaMercanciaAdm" class="table table-bordered table-striped">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Sede</th>
                                        <th>Usuario</th>
                                        <th>N° Pedido</th>
                                        <th>RUC de transportista</th>
                                        <th>Nombre de transportista</th>
                                        <th>Forma de envío</th>
                                        <th>N° Entrada</th>
                                        <th>Proveedor</th>
                                        <th>Fecha de recepción</th>
                                        <th>Guía</th>
                                        <th>Código</th>
                                        <th>Adjuntos</th>
                                        <th>Nota de recepción</th>
                                    </tr>
                                </thead>
                                <tbody id="tbodyDetalleEntradas_EntradaMercanciaAdm">
                                    <tr>
                                        <td colspan="13"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        :: Para ver los productos que contiene una entrada debes hacer clic en el número del documento.
                    </div>
                </div>
            </div>

            <!-- Detalle de la entrada de mercancía -->
            <div class="col-lg-12" id="divDetalle_EntradaMercanciaAdm" style="display: none;">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Datos de la entrada de mercancía</b>
                        <div class="pull-right">
                            <a href="#" onclick="listarEntradaMercanciasAdm()">Ver lista</a>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                <label for="txtNumGuia_EntradaMercanciaAdm">N° Guía</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumGuia_EntradaMercanciaAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                <label for="txtNumDoc_EntradaMercanciaAdm">N° Documento</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumDoc_EntradaMercanciaAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                <label for="txtFechaDoc_EntradaMercanciaAdm">Fecha</label>
                                <input type="text" class="form-control form-control-sm" id="txtFechaDoc_EntradaMercanciaAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                <label for="txtTipo_EntradaMercanciaAdm">Tipo</label>
                                <input type="text" class="form-control form-control-sm" id="txtTipo_EntradaMercanciaAdm" disabled>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table id='tDetalle_EntradaMercanciaAdm' class='table table-bordered table-striped'>
                                <thead class='thead-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Código</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody id='tbodyDetalle_EntradaMercanciaAdm'></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer"></div>
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
