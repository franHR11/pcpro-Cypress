-- Tabla para las listas
CREATE TABLE todo_listas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3788d8',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla para las tareas
CREATE TABLE todo_tareas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lista_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    completada BOOLEAN DEFAULT FALSE,
    fecha_limite DATE,
    prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lista_id) REFERENCES todo_listas(id) ON DELETE CASCADE
);
