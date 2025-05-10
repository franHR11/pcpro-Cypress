# Documentación Técnica - Cypress

## Programación

- **Elementos fundamentales del código**: 
  - Variables: Utilizo variables para almacenar datos temporales como IDs de usuarios, eventos, tareas y listas.
  - Constantes: Implemento constantes para valores fijos como colores predeterminados y configuraciones.
  - Operadores: Empleo operadores aritméticos, de comparación, lógicos y de asignación para manipular datos.
  - Tipos de datos: Trabajo con strings para nombres y descripciones, integers para IDs, booleans para estados, arrays para colecciones de datos, y objetos para estructuras complejas.

- **Estructuras de control utilizadas**:
  - Selección: Uso estructuras if-else para validaciones (como verificar sesiones de usuario) y switch-case para manejar diferentes métodos HTTP en las APIs.
  - Repetición: Implemento bucles forEach en JavaScript para recorrer colecciones de eventos, tareas y calendarios.
  - Saltos: Utilizo return para finalizar funciones y exit en PHP para detener la ejecución cuando es necesario.

- **Control de excepciones**: 
  - Implemento bloques try-catch en PHP para capturar y manejar errores en operaciones críticas como conexiones a base de datos y operaciones CRUD.
  - Utilizo manejo de errores HTTP con códigos de estado apropiados (401 para no autorizado, 500 para errores del servidor).
  - Devuelvo mensajes de error en formato JSON para facilitar su procesamiento en el frontend.

- **Documentación del código**: 
  - Incluyo comentarios descriptivos para explicar la funcionalidad de secciones importantes.
  - Documento las APIs con comentarios que indican su propósito, parámetros esperados y respuestas.
  - Utilizo nombres de variables y funciones descriptivos que facilitan la comprensión del código.

- **Paradigma aplicado**: 
  - Programación orientada a objetos en el backend PHP, utilizando clases para representar entidades como eventos, calendarios y tareas.
  - Programación estructurada en el frontend JavaScript, organizando el código en funciones específicas para cada operación.
  - Elegí este enfoque mixto porque permite una clara separación de responsabilidades entre el backend y frontend, facilitando el mantenimiento.

- **Clases y objetos principales**: 
  - Usuarios: Gestiona la autenticación y datos personales.
  - Calendarios: Almacena y organiza los calendarios del usuario.
  - Eventos: Maneja los eventos con sus propiedades (título, fechas, recurrencia).
  - Listas: Organiza las listas de tareas.
  - Tareas: Gestiona las tareas individuales con sus propiedades.
  - Estas clases se relacionan mediante relaciones de uno a muchos (un usuario tiene múltiples calendarios, un calendario tiene múltiples eventos).

- **Conceptos avanzados**: 
  - Herencia: Implemento herencia en las clases JavaScript para compartir funcionalidad común.
  - Polimorfismo: Utilizo métodos que se comportan de manera diferente según el tipo de objeto (eventos normales vs. recurrentes).
  - Interfaces: Defino interfaces claras para la comunicación entre el frontend y backend a través de las APIs RESTful.

- **Gestión de información**: 
  - Utilizo archivos PHP para implementar las APIs y la lógica de negocio.
  - La interacción del usuario se realiza mediante interfaces gráficas web con HTML, CSS y JavaScript.
  - Implemento modales de Bootstrap para formularios de creación y edición.

- **Estructuras de datos**: 
  - Arrays asociativos en PHP para manejar datos de la base de datos.
  - Objetos JSON para la comunicación entre frontend y backend.
  - Sets en JavaScript para gestionar calendarios visibles.
  - Elegí estas estructuras por su eficiencia en el manejo de datos y compatibilidad con el formato de intercambio JSON.

- **Técnicas avanzadas**: 
  - Expresiones regulares para validación de formatos.
  - Flujos de entrada/salida para la comunicación con la base de datos mediante PDO.
  - Manipulación del DOM para actualizar dinámicamente la interfaz de usuario.
  - Fetch API para realizar peticiones asíncronas al servidor.

## Sistemas Informáticos

- **Características del hardware**: 
  - Entorno de desarrollo: Windows 11 Pro con procesador Intel i11, tarjeta gráfica RTX 3090, memoria RAM suficiente para ejecutar Laragon y herramientas de desarrollo.
  - Entorno de producción: Máquina virtual Linux Server Ubuntu 24.04 con 2 vCore CPU, 2GB RAM y 80GB NVMe SSD.

- **Sistema operativo seleccionado**: 
  - Desarrollo: Windows 11 Pro por su compatibilidad con las herramientas de desarrollo utilizadas y su interfaz amigable.
  - Producción: Linux Server Ubuntu 24.04 por su estabilidad, seguridad y rendimiento optimizado para servidores web.

- **Configuración de redes**: 
  - Tipo de red: TCP/IP sobre Ethernet/WiFi en desarrollo, conexión a Internet en producción.
  - Protocolos: HTTP/HTTPS para la comunicación cliente-servidor.
  - Seguridad: Autenticación de usuarios, sesiones PHP seguras, conexiones PDO parametrizadas para prevenir inyección SQL.

- **Sistemas de copias de seguridad**: 
  - Desarrollo: Control de versiones Git para el código fuente, copias manuales de la base de datos.
  - Producción: Backups automáticos programados a través de Plesk para archivos y base de datos.

- **Medidas de seguridad de datos**: 
  - Almacenamiento seguro de contraseñas mediante hash.
  - Validación de sesiones en cada petición a las APIs.
  - Parámetros preparados en consultas SQL para prevenir inyección.
  - HTTPS para la transmisión segura de datos en producción.

- **Configuración de usuarios y permisos**: 
  - Desarrollo: Ejecución bajo el usuario de Windows que inicia Laragon.
  - Producción: Gestión a través de Plesk con usuarios específicos para el servidor web (www-data) y permisos adecuados para directorios de escritura.

- **Documentación de configuración técnica**: 
  - Incluyo documentación en README.md con instrucciones de instalación y configuración.
  - Documento la estructura de la base de datos en los archivos SQL.
  - Proporciono ejemplos de uso y configuración en la documentación.

## Entornos de Desarrollo

- **IDE utilizado**: 
  - Cursor como editor de código principal, configurado con extensiones para PHP, JavaScript y herramientas de depuración.
  - Integración con Git para control de versiones.

- **Automatización de tareas**: 
  - Utilizo Laragon para la gestión automática del servidor local.
  - Scripts de inicialización de base de datos para crear y poblar tablas.
  - Tareas automatizadas para la compilación y despliegue.

- **Control de versiones**: 
  - Utilizo Git como sistema de control de versiones.
  - Repositorio alojado en GitHub para facilitar la colaboración y el seguimiento de cambios.
  - Implemento un flujo de trabajo con ramas para desarrollo, características y producción.

- **Estrategia de refactorización**: 
  - Identifico código duplicado y lo extraigo a funciones reutilizables.
  - Mejoro la legibilidad mediante nombres descriptivos y comentarios.
  - Optimizo consultas a la base de datos y operaciones JavaScript para mejorar el rendimiento.

- **Documentación técnica**: 
  - Utilizo Markdown para la documentación principal (README.md).
  - Incluyo comentarios en el código para explicar funcionalidades complejas.
  - Documento las APIs con ejemplos de uso y respuestas esperadas.

- **Diagramas**: 
  - He creado diagramas de clases para modelar la estructura de la base de datos.
  - Implemento diagramas de comportamiento para visualizar el flujo de interacción usuario-sistema.

## Bases de Datos

- **Sistema gestor seleccionado**: 
  - MySQL por su robustez, rendimiento y compatibilidad con PHP.
  - Elegí MySQL por su amplia adopción en aplicaciones web, documentación extensa y facilidad de uso con PHP a través de PDO.

- **Diseño del modelo entidad-relación**: 
  - Usuarios (1) -> (N) Calendarios (1) -> (N) Eventos
  - Usuarios (1) -> (N) Listas (1) -> (N) Tareas
  - Implemento claves foráneas con restricciones de integridad referencial (ON DELETE CASCADE).

- **Funciones avanzadas**: 
  - Utilizo vistas para consultas complejas que combinan datos de múltiples tablas.
  - Implemento procedimientos almacenados para operaciones frecuentes.
  - Uso disparadores para mantener la integridad de los datos (por ejemplo, al eliminar un calendario, se eliminan automáticamente sus eventos).

- **Mecanismos de protección y recuperación**: 
  - Transacciones para operaciones que afectan a múltiples tablas.
  - Backups regulares de la base de datos.
  - Validación de datos antes de su inserción o actualización.

## Lenguajes de Marcas y Sistemas de Gestión de Información

- **Estructura de documentos HTML**: 
  - Utilizo HTML5 semántico con etiquetas como header, nav, main y footer.
  - Implemento buenas prácticas como atributos alt en imágenes y estructura jerárquica de encabezados.
  - Sigo estándares web actuales para asegurar compatibilidad entre navegadores.

- **Tecnologías frontend**: 
  - CSS: Bootstrap 5 para un diseño responsivo y consistente.
  - JavaScript: Vanilla JS para la lógica del cliente y manipulación del DOM.
  - FullCalendar para la visualización y gestión de calendarios.
  - Elegí estas tecnologías por su robustez, amplia adopción y facilidad de uso.

- **Interacción con el DOM**: 
  - Utilizo JavaScript para manipular dinámicamente el contenido de la página.
  - Implemento event listeners para responder a acciones del usuario.
  - Actualizo el DOM en respuesta a cambios en los datos (como añadir/eliminar eventos).

- **Validación de documentos**: 
  - He validado el HTML y CSS utilizando herramientas estándar para asegurar conformidad con las especificaciones W3C.
  - Implemento validación de formularios tanto en el cliente como en el servidor.

- **Conversión de datos**: 
  - Utilizo JSON como formato de intercambio entre el frontend y backend.
  - Implemento conversión entre formatos de fecha para compatibilidad entre MySQL y JavaScript.
  - Serializo y deserializo objetos PHP a JSON para la comunicación API.

- **Aplicación de gestión empresarial**: 
  - Cypress es una aplicación de gestión empresarial de tipo productividad y organización.
  - Permite la gestión de calendarios, eventos y tareas, facilitando la organización personal y de equipos.
  - Es adecuada para empresas, equipos de trabajo y particulares que necesitan centralizar su agenda y tareas.

## Proyecto Intermodular

- **Objetivo del software**: 
  - Proporcionar una plataforma centralizada para la gestión de calendarios, eventos y listas de tareas.
  - Facilitar la organización personal y profesional mediante una interfaz intuitiva y funcional.

- **Necesidad cubierta**: 
  - Soluciona el problema de la dispersión de herramientas de organización.
  - Centraliza la gestión de calendarios y tareas en una única aplicación.
  - Permite la colaboración y el seguimiento eficiente de actividades.

- **Stack tecnológico**: 
  - Backend: PHP con PDO para acceso a base de datos.
  - Frontend: HTML5, CSS3 (Bootstrap 5), JavaScript.
  - Base de datos: MySQL.
  - Librerías: FullCalendar para visualización de calendarios.
  - Elegí este stack por su robustez, facilidad de implementación y amplia adopción en el desarrollo web.

- **Desarrollo por versiones**: 
  - Versión 1.0: Funcionalidad básica de calendarios y eventos.
  - Versión 1.5: Integración del módulo de listas de tareas.
  - Versión 2.0: Implementación de eventos recurrentes y mejoras en la interfaz.
  - Futuras versiones: Integración con servicios externos, aplicación móvil y funcionalidades colaborativas.
