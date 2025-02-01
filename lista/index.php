<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header('Location: ../login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List - Cypress</title>
    <link rel="icon" type="image/png" href="../assets/cypress-logo.png">
    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'>
    <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="css/todo.css">
</head>
<body>
    <div class="container-fluid p-0">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <div class="d-flex align-items-center">
                    <img src="../assets/cypress-logo.png" alt="Cypress Logo" height="50" class="me-3">
                    <a class="navbar-brand" href="#">Cypress - Todo List</a>
                </div>
                <div class="navbar-text text-white">
                    Bienvenido, <?php echo htmlspecialchars($_SESSION['usuario_nombre']); ?>
                    <a href="../" class="btn btn-outline-light mx-2">Calendario</a>
                    <a href="../api/logout.php" class="btn btn-outline-light">Cerrar sesión</a>
                </div>
            </div>
        </nav>
        <div class="row m-0">
            <!-- Sidebar para listas -->
            <div class="col-md-3 sidebar">
                <h3 class="text-success">Mis Listas</h3>
                <div id="lista-todo"></div>
                <button class="btn btn-primary mt-3 w-100" id="nueva-lista">
                    + Nueva Lista
                </button>
            </div>
            
            <!-- Contenido principal -->
            <div class="col-md-9">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 id="titulo-lista">Tareas</h2>
                    <button class="btn btn-success" id="nueva-tarea">+ Nueva Tarea</button>
                </div>
                <div id="tareas-container"></div>
            </div>
        </div>
    </div>

    <!-- Modal para nueva lista -->
    <div class="modal fade" id="listaModal" tabindex="-1" aria-labelledby="listaModalLabel" aria-modal="true" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nueva Lista</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="listaForm">
                        <input type="hidden" id="lista_id">
                        <div class="mb-3">
                            <label>Nombre</label>
                            <input type="text" class="form-control" id="lista_nombre" required>
                        </div>
                        <div class="mb-3">
                            <label>Color</label>
                            <input type="color" class="form-control" id="lista_color" value="#3788d8">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="guardar-lista">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para nueva tarea -->
    <div class="modal fade" id="tareaModal" tabindex="-1" aria-labelledby="tareaModalLabel" aria-modal="true" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nueva Tarea</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="tareaForm">
                        <input type="hidden" id="tarea_id">
                        <div class="mb-3">
                            <label>Título</label>
                            <input type="text" class="form-control" id="tarea_titulo" required>
                        </div>
                        <div class="mb-3">
                            <label>Descripción</label>
                            <textarea class="form-control" id="tarea_descripcion"></textarea>
                        </div>
                        <div class="mb-3">
                            <label>Fecha Límite</label>
                            <input type="date" class="form-control" id="tarea_fecha_limite">
                        </div>
                        <div class="mb-3">
                            <label>Prioridad</label>
                            <select class="form-control" id="tarea_prioridad">
                                <option value="baja">Baja</option>
                                <option value="media" selected>Media</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="eliminar-tarea">Eliminar</button>
                    <button type="button" class="btn btn-primary" id="guardar-tarea">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/todo.js"></script>
</body>
</html>
