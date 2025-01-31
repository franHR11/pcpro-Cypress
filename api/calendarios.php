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
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT * FROM calendarios WHERE id = ? AND usuario_id = ?");
                $stmt->execute([$_GET['id'], $_SESSION['usuario_id']]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } else {
                $stmt = $pdo->prepare("SELECT * FROM calendarios WHERE usuario_id = ?");
                $stmt->execute([$_SESSION['usuario_id']]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;
        
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                throw new Exception('Datos inválidos');
            }
            
            $stmt = $pdo->prepare("INSERT INTO calendarios (usuario_id, nombre, color) VALUES (?, ?, ?)");
            $stmt->execute([$_SESSION['usuario_id'], $data['nombre'], $data['color']]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
        
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                throw new Exception('Datos inválidos');
            }
            
            $stmt = $pdo->prepare("UPDATE calendarios SET nombre = ?, color = ? WHERE id = ? AND usuario_id = ?");
            $stmt->execute([$data['nombre'], $data['color'], $data['id'], $_SESSION['usuario_id']]);
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            if (!isset($_GET['id'])) {
                throw new Exception('ID no proporcionado');
            }
            
            $stmt = $pdo->prepare("DELETE FROM calendarios WHERE id = ? AND usuario_id = ?");
            $stmt->execute([$_GET['id'], $_SESSION['usuario_id']]);
            echo json_encode(['success' => true]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
