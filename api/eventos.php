<?php
session_start();
require_once '../config/db.php';

// Asegurarse de que no haya salida antes de los headers
error_reporting(E_ALL);
ini_set('display_errors', 1); // Habilitar la visualización de errores

if (!isset($_SESSION['usuario_id'])) {
    header('Content-Type: application/json');
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

header('Content-Type: application/json');

try {
    switch($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $stmt = $pdo->prepare("
                SELECT 
                    e.*,
                    c.color as calendario_color,
                    c.nombre as calendario_nombre
                FROM eventos e
                INNER JOIN calendarios c ON e.calendario_id = c.id 
                WHERE c.usuario_id = ?
                ORDER BY e.fecha_inicio ASC
            ");
            $stmt->execute([$_SESSION['usuario_id']]);
            $eventos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Formatear fechas para asegurar compatibilidad
            foreach ($eventos as &$evento) {
                $evento['fecha_inicio'] = date('Y-m-d\TH:i:s', strtotime($evento['fecha_inicio']));
                $evento['fecha_fin'] = date('Y-m-d\TH:i:s', strtotime($evento['fecha_fin']));
            }
            
            echo json_encode($eventos);
            break;
        
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                throw new Exception('Datos inválidos');
            }
            
            // Primero obtener el color del calendario
            $stmt = $pdo->prepare("SELECT color FROM calendarios WHERE id = ?");
            $stmt->execute([$data['calendario_id']]);
            $calendario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$calendario) {
                throw new Exception('Calendario no encontrado');
            }
            
            // Agregar el color a los datos del evento
            $data['calendario_color'] = $calendario['color'];
            
            // Depuración: Verificar los datos recibidos
            error_log(print_r($data, true));
            // Depuración adicional de $data
            error_log('Depuración dias_semana: ' . print_r($data['dias_semana'], true));
            
            // Depuración extra
            error_log('Datos POST decodificados: ' . print_r($data, true));
            
            $stmt = $pdo->prepare("INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin, calendario_id, recurrencia, recurrencia_fin, dias_semana) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['titulo'],
                $data['descripcion'],
                $data['fecha_inicio'],
                $data['fecha_fin'],
                $data['calendario_id'],
                $data['recurrencia'],
                $data['recurrencia_fin'],
                json_encode($data['dias_semana']) // Asegúrate de que los días de la semana se almacenen como JSON
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId(), 'color' => $calendario['color']]);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            // Depuración: Verificar los datos recibidos
            error_log(print_r($data, true));
            
            $stmt = $pdo->prepare("UPDATE eventos SET titulo = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, calendario_id = ?, recurrencia = ?, recurrencia_fin = ?, dias_semana = ? WHERE id = ?");
            $stmt->execute([
                $data['titulo'],
                $data['descripcion'],
                $data['fecha_inicio'],
                $data['fecha_fin'],
                $data['calendario_id'],
                $data['recurrencia'],
                $data['recurrencia_fin'],
                json_encode($data['dias_semana']), // Asegúrate de que los días de la semana se almacenen como JSON
                $data['id']
            ]);
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            if (!isset($_GET['id'])) {
                throw new Exception('ID no proporcionado');
            }
            $stmt = $pdo->prepare("DELETE FROM eventos WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(['success' => true]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
