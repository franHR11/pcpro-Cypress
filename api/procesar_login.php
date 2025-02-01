<?php
require_once '../config/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];

    try {
        $stmt = $pdo->prepare("SELECT id, nombre, password FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && password_verify($password, $usuario['password'])) {
            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['usuario_nombre'] = $usuario['nombre'];
            header('Location: ../index.php');
            exit;
        } else {
            header('Location: ../login.php?error=1');
            exit;
        }
    } catch(PDOException $e) {
        error_log("Error en login: " . $e->getMessage());
        header('Location: ../login.php?error=2');
        exit;
    }
} else {
    header('Location: ../login.php');
    exit;
}
