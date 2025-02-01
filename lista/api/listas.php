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
            $stmt = $pdo->prepare("SELECT * FROM todo_listas WHERE usuario_id = ?");
            $stmt->execute([$_SESSION['usuario_id']]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
        
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("INSERT INTO todo_listas (usuario_id, nombre, color) VALUES (?, ?, ?)");
            $stmt->execute([$_SESSION['usuario_id'], $data['nombre'], $data['color']]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE todo_listas SET nombre = ?, color = ? WHERE id = ? AND usuario_id = ?");
            $stmt->execute([$data['nombre'], $data['color'], $data['id'], $_SESSION['usuario_id']]);
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            $id = $_GET['id'];
            $stmt = $pdo->prepare("DELETE FROM todo_listas WHERE id = ? AND usuario_id = ?");
            $stmt->execute([$id, $_SESSION['usuario_id']]);
            echo json_encode(['success' => true]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
