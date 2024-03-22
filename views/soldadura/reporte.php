<?php

date_default_timezone_set("America/Lima");
session_start();

if (isset($_SESSION['ga-usuario'])) {
    include("../tmp_header.html");
    if (in_array($_SESSION['ga-area'], ['RESPONSABLE DE ALMACEN', 'SISTEMAS']))  {
?>

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="#">SOLDADURA</a>
            </li>
            <li class="breadcrumb-item active">Reporte</li>
        </ol>

        <div class="container-fluid">
            <div class="row">
                <!-- Lista de importaciones registradas -->
                <div class="col-lg-12" id="dl">
                    <div class="card mt-3">
                        <div class="card-header">
                            <b>Lista de Confirmaciones</b>
                        </div>
                        <div class="card-body">
                            <div style="margin-bottom: 10px;">
                            <label style="font-size: 14px;"><b>RANGO DE FECHAS</b> Escoge las fechas de consulta para generar el reporte</label>
                            <div class="pull-right">
                                <button type="button" class="btn btn-sm btn-secondary" onclick="jsReporteTiempoAtencion();">
                                    <i class="fa fa-check-circle"></i> CONSULTAR
                                </button>
                            </div>
                            <form>
                                <div class="form-group row">
                                    <label for="txtFechaInicio" class="col-lg-2 col-form-label"><i class="fa fa-calendar-times-o"></i> INICIO:</label>
                                    <div class="col-lg-2" style="padding-top: 4px;">
                                        <input type="date" class="form-control form-control-sm" id="txtFechaInicio" value="<?php echo date('Y-m-d') ?>" min="2017-07-01">
                                    </div>
                                    <label for="txtFechaFin" class="col-lg-2 col-form-label"><i class="fa fa-calendar-times-o"></i> TÉRMINO:</label>
                                    <div class="col-lg-2" style="padding-top: 4px;">
                                        <input type="date" class="form-control form-control-sm" id="txtFechaFin" value="<?php echo date('Y-m-d') ?>" min="2017-07-01">
                                    </div>
                                    <label for="cboEstado" class="col-lg-2 col-form-label"><i class="fa fa-filter"></i> ESTADO:</label>
                                    <div class="col-lg-2" style="padding-top: 4px;">
                                        <select class="form-control form-control-sm" id="cboEstado">
                                            <option value="1">Confirmados</option>
                                            <option value="s0">Rechazados</option>
                                        </select>
                                    </div>
                                </div>
                            </form>

                            <div class="card">
                                <div class="card-header">
                                    <i class="fa fa-file-archive-o"></i><b> Reporte</b> - Tiempo de atención por movimiento
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive" id="divTabla">
                                        <label for="">...Esperando parámetros.</label>
                                    </div>
                                </div>
                                <div class="card-footer small text-muted">Actualizado hasta el momento de la consulta.</div>
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
        include("../no_autorizado.html");
    }
    include("../tmp_footer.html");
} else {
    header("Location: ../../login");
}
?>