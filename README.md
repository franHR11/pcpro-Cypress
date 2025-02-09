# Cypress - Gestor de Calendarios y Tareas

Cypress es una aplicación web que combina un gestor de calendarios y una lista de tareas, permitiendo a los usuarios organizar sus eventos y actividades de manera eficiente.

## Características

### Sistema de Calendario
- Múltiples vistas: mes, semana y día
- Creación de múltiples calendarios por usuario
- Personalización de color para cada calendario
- Eventos recurrentes (diarios, semanales, quincenales, mensuales)
- Eventos con fecha y hora de inicio/fin
- Descripción detallada de eventos
- Visibilidad de calendarios configurable

### Lista de Tareas (Todo List)
- Organización de tareas por listas
- Personalización de color para cada lista
- Niveles de prioridad para tareas
- Fechas límite para tareas
- Estado de completado
- Descripción detallada de tareas

## Requisitos Técnicos

### Base de Datos
- MySQL 5.7+
- Base de datos: "************"
- Usuario: "********"
- Contraseña: "*********"

### Servidor
- PHP 7.4+
- Apache/XAMPP
- PDO PHP Extension
- JSON PHP Extension

### Frontend
- Bootstrap 5.1.3
- FullCalendar 5.11.3

## Instalación

1. Clonar el repositorio en la carpeta htdocs de XAMPP:
```bash
git clone [url-repositorio] /xampp/htdocs/pcpro-Cypress
```

2. Crear la base de datos y el usuario:
```sql
CREATE DATABASE cypress;
CREATE USER 'cypress'@'localhost' IDENTIFIED BY 'Cypress123$.';
GRANT ALL PRIVILEGES ON cypress.* TO 'cypress'@'localhost';
FLUSH PRIVILEGES;
```

3. Importar la estructura de la base de datos:
```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de calendarios
CREATE TABLE calendarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3788d8',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de eventos
CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calendario_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    recurrencia ENUM('none', 'daily', 'weekly', 'biweekly', 'monthly') DEFAULT 'none',
    recurrencia_fin DATE,
    dias_semana JSON,
    FOREIGN KEY (calendario_id) REFERENCES calendarios(id) ON DELETE CASCADE
);

-- Tabla de listas de tareas
CREATE TABLE listas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3788d8',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de tareas
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lista_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_limite DATE,
    prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
    completada BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (lista_id) REFERENCES listas(id) ON DELETE CASCADE
);
```

## Uso

1. Acceder a la aplicación:
```
http://localhost/pcpro-Cypress
```

2. Registrarse como nuevo usuario o iniciar sesión

### Gestión de Calendarios
- Crear calendarios desde el panel lateral
- Personalizar color de cada calendario
- Mostrar/ocultar calendarios usando los checkboxes
- Crear eventos haciendo clic en una fecha
- Editar eventos haciendo clic sobre ellos
- Configurar eventos recurrentes seleccionando frecuencia y días

### Gestión de Tareas
- Acceder a la lista de tareas desde el botón "Todo List"
- Crear listas de tareas personalizadas
- Asignar colores a las listas
- Crear tareas con título, descripción y fecha límite
- Marcar tareas como completadas
- Establecer prioridades para las tareas

## Seguridad
- Autenticación requerida para todas las operaciones
- Contraseñas encriptadas
- Validación de sesiones
- Protección contra inyección SQL mediante PDO
- Sanitización de datos de entrada

## Estructura de Archivos
```
pcpro-Cypress/
├── api/
│   ├── calendarios.php
│   ├── eventos.php
│   ├── listas.php
│   ├── tareas.php
│   ├── registro.php
│   ├── login.php
│   └── logout.php
├── assets/
│   ├── cypress-logo.png
│   └── fondo.png
├── config/
│   └── db.php
├── css/
│   └── styles.css
├── js/
│   ├── calendario.js
│   └── todo.js
├── lista/
│   └── index.php
├── index.php
├── login.php
├── registro.php
└── README.md
```

## Contribución
Las contribuciones son bienvenidas. Por favor, crear un fork del repositorio y enviar pull requests para cualquier mejora.

## Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.
## Autor
franHR