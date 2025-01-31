<?php
session_start();
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    try {
        // Verificar si el email ya existe
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) {
            header('Location: ../registro.php?error=email_exists');
            exit;
        }
        
        // Insertar nuevo usuario
        $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$nombre, $email, $password]);
        
        // Crear calendario por defecto para el usuario
        $usuario_id = $pdo->lastInsertId();
        $stmt = $pdo->prepare("INSERT INTO calendarios (usuario_id, nombre, color) VALUES (?, 'Principal', '#3788d8')");
        $stmt->execute([$usuario_id]);
        
        header('Location: ../login.php?registro=success');
        exit;
    } catch(PDOException $e) {
        header('Location: ../registro.php?error=db&msg=' . urlencode($e->getMessage()));
        exit;
    }
}
?>
