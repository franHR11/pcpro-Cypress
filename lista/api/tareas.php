<?php
session_start();
require_once '../../config/db.php';

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
            if (isset($_GET['id'])) {
                // Obtener una tarea específica
                $stmt = $pdo->prepare("
                    SELECT t.* FROM todo_tareas t 
                    INNER JOIN todo_listas l ON t.lista_id = l.id 
                    WHERE l.usuario_id = ? AND t.id = ?
                ");
                $stmt->execute([$_SESSION['usuario_id'], $_GET['id']]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } else if (isset($_GET['lista_id'])) {
                // Obtener tareas por lista
                $lista_id = $_GET['lista_id'] ?? null;
                if ($lista_id) {
                    $stmt = $pdo->prepare("
                        SELECT t.* FROM todo_tareas t 
                        INNER JOIN todo_listas l ON t.lista_id = l.id 
                        WHERE l.usuario_id = ? AND t.lista_id = ?
                        ORDER BY t.created_at DESC
                    ");
                    $stmt->execute([$_SESSION['usuario_id'], $lista_id]);
                } else {
                    $stmt = $pdo->prepare("
                        SELECT t.* FROM todo_tareas t 
                        INNER JOIN todo_listas l ON t.lista_id = l.id 
                        WHERE l.usuario_id = ?
                        ORDER BY t.created_at DESC
                    ");
                    $stmt->execute([$_SESSION['usuario_id']]);
                }
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;
        
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("
                INSERT INTO todo_tareas (lista_id, titulo, descripcion, fecha_limite, prioridad) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['lista_id'],
                $data['titulo'],
                $data['descripcion'],
                $data['fecha_limite'],
                $data['prioridad']
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['completada'])) {
                // Actualizar solo el estado de completada
                $stmt = $pdo->prepare("UPDATE todo_tareas SET completada = ? WHERE id = ?");
                $stmt->execute([$data['completada'], $data['id']]);
            } else {
                // Actualizar todos los campos
                $stmt = $pdo->prepare("
                    UPDATE todo_tareas 
                    SET titulo = ?, descripcion = ?, fecha_limite = ?, prioridad = ? 
                    WHERE id = ?
                ");
                $stmt->execute([
                    $data['titulo'],
                    $data['descripcion'],
                    $data['fecha_limite'],
                    $data['prioridad'],
                    $data['id']
                ]);
            }
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            $id = $_GET['id'];
            $stmt = $pdo->prepare("DELETE FROM todo_tareas WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
