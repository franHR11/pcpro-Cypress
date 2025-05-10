# 📅 Cypress - Gestor de Calendarios y Tareas

Bienvenido a **Cypress**, una potente aplicación web para la gestión de calendarios, eventos y listas de tareas (Todo List), diseñada para profesionales, equipos y particulares que buscan optimizar su organización diaria.

---

## 📌 Descripción del Proyecto

Cypress es una plataforma web que permite a los usuarios gestionar múltiples calendarios, crear eventos con recurrencia, y organizar tareas en listas personalizadas. Pensada para usuarios que desean centralizar su agenda y tareas en un solo lugar, es ideal para profesionales, empresas, estudiantes y cualquier persona que valore la productividad y la organización.

**Utilidad y enfoque comercial:**
- Centraliza la gestión de calendarios y tareas.
- Permite la colaboración y el seguimiento eficiente de actividades.
- Solución adaptable para empresas, academias, equipos de trabajo y uso personal.

---

## ✨ Características Principales

- 🛠️ **Gestión de Calendarios:** Crea, edita y elimina calendarios personalizados.
- 📅 **Eventos Avanzados:** Añade eventos con recurrencia (diaria, semanal, mensual, etc.) y notificaciones.
- 📋 **Todo List Integrado:** Organiza tus tareas en listas, asigna prioridades y fechas límite.
- 👤 **Autenticación Segura:** Registro y login de usuarios con sesiones seguras.
- 🔒 **Protección de Datos:** Acceso privado a datos mediante sesiones PHP.
- 📊 **Panel de Usuario:** Interfaz intuitiva con panel principal para calendarios y sección dedicada a tareas.
- 🔄 **Integración de Módulos:** Navegación fluida entre Calendario y Todo List.
- 🖼️ **Interfaz Moderna:** UI responsiva con Bootstrap 5 y FullCalendar.
- 🐘 **Backend PHP:** API RESTful para operaciones CRUD sobre calendarios, eventos y tareas.
- 🐬 **Base de Datos MySQL:** Gestión robusta de usuarios, calendarios, eventos y tareas.

---

## ⚙️ Funcionalidades

### Módulos Principales
- **Calendario:** Visualización mensual/semanal/diaria, creación de eventos, edición y eliminación, soporte para eventos recurrentes.
- **Todo List:** Listas de tareas agrupadas, creación/edición/eliminación de tareas, asignación de prioridades y fechas límite.
- **Autenticación:** Registro, inicio y cierre de sesión, protección de rutas y APIs mediante sesiones.
- **Panel de Usuario:** Navegación entre módulos desde la barra superior, bienvenida personalizada.

### Servicios y APIs
- `/api/calendarios.php`: CRUD de calendarios.
- `/api/eventos.php`: CRUD de eventos y gestión de recurrencia.
- `/api/auth.php`, `/api/procesar_login.php`, `/api/registro.php`, `/api/logout.php`: Autenticación y gestión de sesiones.
- `/lista/api/listas.php`: CRUD de listas de tareas.
- `/lista/api/tareas.php`: CRUD de tareas.

### Seguridad
- Acceso restringido a usuarios autenticados.
- Manejo seguro de contraseñas y sesiones.

---

## 🔧 Tecnologías Utilizadas

- 🐘 **PHP** (backend, APIs)
- 🐬 **MySQL** (base de datos)
- 🟦 **Bootstrap 5** (UI y estilos)
- 📅 **FullCalendar** (visualización de calendarios)
- ⚡ **JavaScript** (frontend dinámico)
- 📦 **PDO** (acceso seguro a la base de datos)

---

## 🧪 Estructura de Archivos y Carpetas

```
/ (raíz)
│
├── api/                # Endpoints PHP para calendarios y eventos
├── assets/             # Imágenes y recursos gráficos
├── config/             # Configuración de conexión a base de datos
├── css/                # Estilos globales (styles.css)
├── db/                 # Scripts SQL para la base de datos
├── js/                 # Lógica de frontend (calendario.js)
├── lista/              # Módulo Todo List (subcarpetas: api, css, js)
│   ├── api/            # Endpoints PHP para listas y tareas
│   ├── css/            # Estilos Todo List
│   └── js/             # Lógica Todo List
├── index.php           # Página principal (Calendario)
├── login.php           # Página de login
├── registro.php        # Página de registro
└── README.md           # Este archivo
```

**Carpetas clave:**
- `api/`: Lógica backend de calendarios y eventos.
- `lista/`: Todo List, con APIs y frontend propios.
- `db/`: Scripts para crear y poblar la base de datos.
- `config/`: Configuración de conexión (db.php).
- `assets/`: Recursos gráficos (logo, imágenes).

---

## 🛠️ Instrucciones de Uso

### 1. Instalación de dependencias
- Requiere **PHP >=7.4**, **MySQL** y servidor web (recomendado: Laragon, XAMPP, MAMP).
- Clona el repositorio en tu entorno local.

### 2. Configuración de la base de datos
- Importa los archivos `db/schema.sql` y `db/todo_tables.sql` en tu servidor MySQL.
- Crea un usuario y asigna permisos sobre la base de datos `calendario_db`.

### 3. Configuración de variables
- Edita `config/db.php` con tus credenciales de conexión:

```php
$pdo = new PDO(
    "mysql:host=localhost;dbname=TU_BD;charset=utf8",
    "TU_USUARIO",
    "TU_PASSWORD",
    [...]
);
```

### 4. Ejecución en local
- Inicia tu servidor local (ej: Laragon).
- Accede a `http://localhost/pcpro-Cypress` en tu navegador.

### 5. Build, Deploy y Pruebas
- No requiere build adicional (PHP + JS nativo).
- Puedes desplegar en cualquier hosting compatible con PHP y MySQL.

---

## 📝 Ejemplo de Uso

### Endpoint: Obtener eventos del usuario
```http
GET /api/eventos.php
Headers: { Cookie: PHPSESSID=... }
Response: [
  {
    "id": 1,
    "titulo": "Reunión",
    "fecha_inicio": "2025-05-10T09:00:00",
    ...
  }
]
```

### Ejemplo de conexión a la base de datos
```php
require_once 'config/db.php';
// $pdo disponible para consultas
```

---

## 🗄️ Estructura de la Base de Datos

### Tablas principales
- **usuarios**: id, email, password, nombre, created_at
- **calendarios**: id, usuario_id, nombre, color, created_at
- **eventos**: id, calendario_id, titulo, descripcion, fecha_inicio, fecha_fin, recurrencia, recurrencia_fin, dias_semana, created_at
- **todo_listas**: id, usuario_id, nombre, color, created_at
- **todo_tareas**: id, lista_id, titulo, descripcion, completada, fecha_limite, prioridad, created_at

### Ejemplo de conexión
Ver sección de configuración arriba.

---

## 🔑 Variables de entorno y configuración

Ejemplo (no incluir credenciales reales):
```php
// config/db.php
$pdo = new PDO(
    "mysql:host=localhost;dbname=calendario_db;charset=utf8",
    "usuario",
    "password",
    [...]
);
```

---

## 🏷️ Licencia

### Español
Copyright (c) 2025 Francisco José Herreros (franHR) / PCProgramación

Todos los derechos reservados.

Este software es propiedad de Francisco José Herreros (franHR), desarrollador de PCProgramación (https://www.pcprogramacion.es). No está permitido copiar, modificar, distribuir o utilizar este código, ni total ni parcialmente, sin una autorización expresa y por escrito del autor.

El acceso a este repositorio tiene únicamente fines de revisión, auditoría o demostración, y no implica la cesión de ningún derecho de uso o explotación.

Para solicitar una licencia o permiso de uso, contacta con: desarrollo@pcprogramacion.es

### English
Copyright (c) 2025 Francisco José Herreros (franHR) / PCProgramación

All rights reserved.

This software is the property of Francisco José Herreros (franHR), developer of PCProgramación (https://www.pcprogramacion.es). You may not copy, modify, distribute, or use this code, in whole or in part, without the express written permission of the author.

Access to this repository is strictly for review, auditing, or demonstration purposes, and does not grant any rights to use or exploit the software.

To request a license or permission, contact: desarrollo@pcprogramacion.es

---

> Desarrollado por Francisco José Herreros (franHR) · PCProgramación
