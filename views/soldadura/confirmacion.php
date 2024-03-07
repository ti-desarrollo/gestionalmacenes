<?php
$numero = 0;
$numero++;
date_default_timezone_set('America/Lima');
session_start();
if (isset($_SESSION['ga-usuario'])) {
    include('../tmp_header.html');
    if (in_array($_SESSION['ga-area'], ['RESPONSABLE DE ALMACEN', 'SISTEMAS'])) {
?>
        <script type="text/javascript">
            $(document).ready(
                function() {
                    jsListarSobrantes();
                    setInterval(jsNotificadorSobrantes, 3000);
                }
            );
        </script>

        <!-- Importamos el archivo js -->
        <script src="../../libs/js/funciones/soldadura/conformidad.js"></script>
        <script src="../../libs/js/funciones/msjes.js"></script>

        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">SOLDADURA</a>
            </li>
            <li class="breadcrumb-item active">Confirmación</li>
        </ol>

        <div class="row">
            <div class="col-12">
                <div class="card mb-3">
                    <div class="card-header">
                        <i class="fa fa-file-archive-o"></i> VERIFICACION DE SOBRANTES - <b>Área: Almacenes</b>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive" id="divTablaSobrantes"> </div>
                    </div>
                    <div class="card-footer small text-muted">Los registros recientes se muestran primero.</div>
                </div>
            </div>
        </div>

        <!-- Modal detalle de Confirmacion -->
        <div class="modal fade" id="dmlConfirmacion" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="divCabeceraDev"></h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">X</span></button>
                    </div>
                    <div class="modal-body">
                        <div id="divAutorizacion">
                            <h6><b><u>AUTORIZACIÓN</u></b></h6>
                            <form id="frmAutorizacion">
                                <input type="hidden" id="txtID">
                                <div class="form-row">
                                    <div class="col-md-12">
                                        <label for="txtOP"><b>N° OPERACION:</b></label>
                                        <input type="text" class="form-control form-control-sm" id="txtOP" onkeyup="verificarViaticos(11);" disabled>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="col-md-6">
                                        <label for="txtEmpleado"><b>EMPLEADO:</b></label>
                                        <input type="text" class="form-control form-control-sm" id="txtEmpleado" onkeyup="verificarViaticos(11);" value="<?php echo $_SESSION['ga-naUsu'] ?>" disabled>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="txtFC"><b>FECHA DE CONFIRMACIÓN:</b></label>
                                        <input type="date" class="form-control form-control-sm" id="txtFC" onkeyup="verificarViaticos(11);" min="<?php echo date("Y-m-d", strtotime(date("Y-m-d") . "- 2 days")); ?>" max="<?php echo date("Y-m-d", strtotime(date("Y-m-d") . "+ 0 days")); ?>" value="<?php echo date("Y-m-d") ?>">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="col-md-8">
                                        <label><b>OBSERVACIONES</b></label>
                                        <textarea class="form-control form-control-sm" id="txtComentarios" rows="2" onkeyup="verificarViaticos(10);"></textarea>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="txtDocumento"><b>Documento (PDF/JPG/JPEG):</b></label>
                                        <input class="form-control form-control-sm" id="txtDocumento" name="txtDocumento" type="file" accept="image/jpg,image/jpeg,image/png,application/pdf" required>
                                    </div>
                                </div>
                            </form>
                            <table width="100%">
                                <tr>
                                    <td>
                                        <button class="btn btn-danger btn-block btn-sm" id="btnRechazar" onclick="jsActualizarConformidad(0);">
                                            <i class="fa fa-thumbs-o-down"></i> Rechazar
                                        </button>
                                    </td>
                                    <td>
                                        <button class="btn btn-success btn-block btn-sm" id="btnConfirmar" onclick="jsActualizarConformidad(1);">
                                            <i class="fa fa-thumbs-o-up"></i> Confirmar
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal detalle de Sobrantes -->
        <div class="modal fade" id="dmlSobrante" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="divCabeceraDev"></h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">X</span></button>
                    </div>
                    <div class="modal-body">
                        <form style="margin-bottom: 15px;">
                            <div class="form-row">
                                <div class="col-md-6">
                                    <label><b>EMAIL EMPLEADO</b></label>
                                    <input class="form-control form-control-sm" id="emailEmpleado" type="text" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label><b>NOMBRE EMPLEADO</b></label>
                                    <input class="form-control form-control-sm" id="nombreEmpleado" type="text" readonly>
                                </div>
                                <div class="col-md-12">
                                    <label><b>Adjunto:</b></label>
                                    <div id="adjunto"></div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-md">
                                    <label><b>FECHA DE PESAJE</b></label>
                                    <input class="form-control form-control-sm" id="fechaPesaje" type="text" readonly>
                                </div>
                                <div class="col-md">
                                    <label><b>ESTADO</b></label>
                                    <input class="form-control form-control-sm" id="estado" type="text" readonly>
                                </div>
                            </div>
                        </form>
                    </div>
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

<?php
    } else {
        include("../no_autorizado.html");
    }
    include("../tmp_footer.html");
} else {
    header("Location: ../../login.php");
}
?>