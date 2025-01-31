<?php
session_start();
require_once '../config/db.php';

// Asegurarse de que no haya salida antes de los headers
error_reporting(E_ALL);
ini_set('display_errors', 0);

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
            
            $stmt = $pdo->prepare("INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin, calendario_id, recurrencia, recurrencia_fin) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['titulo'],
                $data['descripcion'],
                $data['fecha_inicio'],
                $data['fecha_fin'],
                $data['calendario_id'],
                $data['recurrencia'],
                $data['recurrencia_fin']
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE eventos SET titulo = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, calendario_id = ?, recurrencia = ?, recurrencia_fin = ? WHERE id = ?");
            $stmt->execute([
                $data['titulo'],
                $data['descripcion'],
                $data['fecha_inicio'],
                $data['fecha_fin'],
                $data['calendario_id'],
                $data['recurrencia'],
                $data['recurrencia_fin'],
                $data['id']
            ]);
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            $id = $_GET['id'];
            $stmt = $pdo->prepare("DELETE FROM eventos WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
