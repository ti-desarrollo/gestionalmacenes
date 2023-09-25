<?php

date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'], $_SESSION['ga-idUsu'], $_SESSION['ga-sedeUsu'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-idPerfilUsu'], [1, 2, 3, 4])) {
?>
        <script type="text/javascript">
            $(document).ready(
                function() {
                    listarTransferenciasAdm();
                }
            );
        </script>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">MESA DE PARTES</a>
            </li>
            <li class="breadcrumb-item active">Transferencias de stock</li>
        </ol>


        <div class="row">

            <!-- Lista de transferencias -->
            <div class="col-lg-12" id="divLista_TransferenciaStockAdm">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Lista de transferencias de stock</b>
                    </div>
                    <div class="card-body">
                        <div class="pull-right" style="padding-bottom: 10px;">
                            <form class="form-inline">
                                <div class="form-group">
                                    <input type="date" class="form-control" id="txtFechaInicio_TransferenciaStockAdm" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <div class="form-group mx-2">
                                    <input type="date" class="form-control" id="txtFechaFin_TransferenciaStockAdm" value="<?php echo date("Y-m-d") ?>">
                                </div>
                                <button type="button" class="btn btn-primary" id="btnReportar_TransferenciaStockAdm" onclick="listarTransferenciasAdm()">
                                    <i class="fa fa-play"></i> REPORTAR
                                </button>
                            </form>
                        </div>
                        <div class="table-responsive">
                            <table id="tListaTransferencias_TransferenciaStockAdm" class="table table-bordered table-striped">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Código</th>
                                        <th>Responsable</th>
                                        <th>Solicitante</th>
                                        <th>Nº Guía</th>
                                        <th>Fecha</th>
                                        <th>Tipo</th>
                                        <th>Origen</th>
                                        <th>Transportista</th>
                                        <th>Adjuntos</th>
                                        <th>Nota de transferencia</th>
                                    </tr>
                                </thead>
                                <tbody id="tbodyTransferencias_TransferenciaStockAdm">
                                    <tr>
                                        <td colspan="10"><i class="fa fa-spinner fa-2x fa-spin"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        :: Para ver los productos que contiene una transferencia debes hacer clic en el número del documento.
                    </div>
                </div>
            </div>

            <!-- Detalle de la transferencia -->
            <div class="col-lg-12" id="divDetalle_TransferenciaStockAdm" style="display: none;">
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Datos de la transferencia de stock</b>
                        <div class="pull-right">
                            <a href="#" onclick="listarTransferenciasAdm()">Ver lista</a>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                <label for="txtNumGuia_TransferenciaStockAdm">N° Guía</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumGuia_TransferenciaStockAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                <label for="txtNumDoc_TransferenciaStockAdm">N° Documento</label>
                                <input type="text" class="form-control form-control-sm" id="txtNumDoc_TransferenciaStockAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                <label for="txtFechaDoc_TransferenciaStockAdm">Fecha</label>
                                <input type="text" class="form-control form-control-sm" id="txtFechaDoc_TransferenciaStockAdm" disabled>
                            </div>
                            <div class="form-group col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-3">
                                <label for="txtTipo_TransferenciaStockAdm">Tipo</label>
                                <input type="text" class="form-control form-control-sm" id="txtTipo_TransferenciaStockAdm" disabled>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table id="tDetalle_TransferenciaStockAdm" class="table table-bordered table-striped">
                                <thead class="thead-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Código</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody id="tbodyDetalle_TransferenciaStockAdm"></tbody>
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
