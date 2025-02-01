<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendario</title>
    <link rel="icon" type="image/png" href="assets/cypress-logo.png">
    <link href='https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.css' rel='stylesheet'>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container-fluid p-0">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <div class="d-flex align-items-center">
                    <img src="assets/cypress-logo.png" alt="Cypress Logo" height="50" class="me-3">
                    <a class="navbar-brand" href="#">Cypress - Gestor de Calendarios</a>
                </div>
                <div class="navbar-text text-white">
                    Bienvenido, <?php echo htmlspecialchars($_SESSION['usuario_nombre']); ?>
                    <a href="api/logout.php" class="btn btn-outline-light ms-3">Cerrar sesión</a>
                </div>
            </div>
        </nav>
        <div class="row">
            <!-- Sidebar para calendarios -->
            <div class="col-md-2 sidebar">  <!-- Cambiado de col-md-3 a col-md-2 -->
                <h3 class="text-success">Mis Calendarios</h3>
                <div id="lista-calendarios"></div>
                <button class="btn btn-primary mt-3 w-100" id="nuevo-calendario">
                    + Nuevo Calendario
                </button>
            </div>
            
            <!-- Calendario principal -->
            <div class="col-md-10">  <!-- Cambiado de col-md-9 a col-md-10 -->
                <div id="calendario"></div>
            </div>
        </div>
    </div>

    <!-- Modal para eventos -->
    <div class="modal fade" id="eventoModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Evento</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="eventoForm">
                        <input type="hidden" id="evento_id">
                        <div class="mb-3">
                            <label>Título</label>
                            <input type="text" class="form-control" id="titulo" required>
                        </div>
                        <div class="mb-3">
                            <label>Descripción</label>
                            <textarea class="form-control" id="descripcion"></textarea>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label>Fecha Inicio</label>
                                <input type="datetime-local" class="form-control" id="fecha_inicio" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label>Fecha Fin</label>
                                <input type="datetime-local" class="form-control" id="fecha_fin" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label>Calendario</label>
                            <select class="form-control" id="calendario_id" required>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label>Recurrencia</label>
                            <select class="form-control" id="recurrencia">
                                <option value="none">Sin recurrencia</option>
                                <option value="daily">Diaria</option>
                                <option value="weekly">Semanal</option>
                                <option value="biweekly">Cada 2 semanas</option>
                                <option value="monthly">Mensual</option>
                            </select>
                        </div>
                        <div class="mb-3" id="recurrencia_fin_container" style="display:none;">
                            <label>Repetir hasta</label>
                            <input type="date" class="form-control" id="recurrencia_fin">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="eliminar-evento">Eliminar</button>
                    <button type="button" class="btn btn-primary" id="guardar-evento">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para nuevo calendario -->
    <div class="modal fade" id="calendarioModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nuevo Calendario</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="calendarioForm">
                        <div class="mb-3">
                            <label>Nombre</label>
                            <input type="text" class="form-control" id="calendario_nombre" required>
                        </div>
                        <div class="mb-3">
                            <label>Color</label>
                            <input type="color" class="form-control" id="calendario_color" value="#3788d8">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="guardar-calendario">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.js'></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/calendario.js"></script>
</body>
</html>
