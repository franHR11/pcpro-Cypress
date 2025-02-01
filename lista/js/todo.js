document.addEventListener('DOMContentLoaded', function() {
    const listaModal = new bootstrap.Modal(document.getElementById('listaModal'));
    const tareaModal = new bootstrap.Modal(document.getElementById('tareaModal'));
    let listaActual = null;

    // Cargar listas al inicio
    cargarListas();

    // Event Listeners
    document.getElementById('nueva-lista').addEventListener('click', () => {
        document.getElementById('lista_id').value = '';
        document.getElementById('lista_nombre').value = '';
        document.getElementById('lista_color').value = '#3788d8';
        listaModal.show();
    });

    document.getElementById('nueva-tarea').addEventListener('click', () => {
        if (!listaActual) {
            alert('Por favor, selecciona una lista primero');
            return;
        }
        document.getElementById('tarea_id').value = '';
        document.getElementById('tareaForm').reset();
        tareaModal.show();
    });

    document.getElementById('guardar-lista').addEventListener('click', guardarLista);
    document.getElementById('guardar-tarea').addEventListener('click', guardarTarea);
    document.getElementById('eliminar-tarea').addEventListener('click', eliminarTarea);

    function agregarEventListeners() {
        // Event listeners para las listas
        document.querySelectorAll('.lista-item').forEach(item => {
            item.addEventListener('click', function() {
                listaActual = this.dataset.id;
                document.querySelectorAll('.lista-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                document.getElementById('titulo-lista').textContent = this.querySelector('.lista-nombre').textContent;
                cargarTareas(listaActual);
            });

            // Botones de editar y eliminar lista
            item.querySelector('.btn-editar').addEventListener('click', (e) => {
                e.stopPropagation();
                editarLista(item.dataset.id);
            });

            item.querySelector('.btn-eliminar').addEventListener('click', (e) => {
                e.stopPropagation();
                eliminarLista(item.dataset.id);
            });
        });
    }

    function agregarEventListenersTareas() {
        // Event listeners para las tareas
        document.querySelectorAll('.tarea-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                actualizarEstadoTarea(item.dataset.id, checkbox.checked);
            });

            item.querySelector('.btn-editar').addEventListener('click', () => {
                editarTarea(item.dataset.id);
            });

            item.querySelector('.btn-eliminar').addEventListener('click', () => {
                eliminarTarea(item.dataset.id);
            });
        });
    }

    // Funciones CRUD para listas
    function guardarLista() {
        const formData = {
            nombre: document.getElementById('lista_nombre').value,
            color: document.getElementById('lista_color').value
        };

        const id = document.getElementById('lista_id').value;
        const method = id ? 'PUT' : 'POST';
        if (id) formData.id = id;

        fetch('api/listas.php', {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            listaModal.hide();
            cargarListas();
        })
        .catch(error => alert('Error al guardar la lista'));
    }

    function editarLista(id) {
        fetch(`api/listas.php?id=${id}`)
            .then(response => response.json())
            .then(lista => {
                document.getElementById('lista_id').value = lista.id;
                document.getElementById('lista_nombre').value = lista.nombre;
                document.getElementById('lista_color').value = lista.color;
                listaModal.show();
            });
    }

    function eliminarLista(id) {
        if (confirm('¿Estás seguro de eliminar esta lista?')) {
            fetch(`api/listas.php?id=${id}`, {method: 'DELETE'})
                .then(response => response.json())
                .then(data => {
                    if (listaActual === id) {
                        listaActual = null;
                        document.getElementById('titulo-lista').textContent = 'Tareas';
                        document.getElementById('tareas-container').innerHTML = '';
                    }
                    cargarListas();
                });
        }
    }

    // Funciones CRUD para tareas
    function guardarTarea() {
        const formData = {
            titulo: document.getElementById('tarea_titulo').value,
            descripcion: document.getElementById('tarea_descripcion').value,
            fecha_limite: document.getElementById('tarea_fecha_limite').value,
            prioridad: document.getElementById('tarea_prioridad').value,
            lista_id: listaActual
        };

        const id = document.getElementById('tarea_id').value;
        const method = id ? 'PUT' : 'POST';
        if (id) formData.id = id;

        fetch('api/tareas.php', {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            tareaModal.hide();
            cargarTareas(listaActual);
        })
        .catch(error => alert('Error al guardar la tarea'));
    }

    function editarTarea(id) {
        // Buscar la tarea en el DOM actual para obtener sus datos
        const tareaElement = document.querySelector(`.tarea-item[data-id="${id}"]`);
        if (tareaElement) {
            const tarea = {
                id: id,
                titulo: tareaElement.querySelector('.tarea-contenido h5').textContent,
                descripcion: tareaElement.querySelector('.tarea-contenido p').textContent,
                fecha_limite: tareaElement.querySelector('.text-muted')?.textContent.replace('Fecha límite: ', '') || '',
                prioridad: tareaElement.classList.contains('prioridad-alta') ? 'alta' :
                          tareaElement.classList.contains('prioridad-media') ? 'media' : 'baja',
                completada: tareaElement.querySelector('input[type="checkbox"]').checked
            };

            // Rellenar el formulario con los datos
            document.getElementById('tarea_id').value = tarea.id;
            document.getElementById('tarea_titulo').value = tarea.titulo;
            document.getElementById('tarea_descripcion').value = tarea.descripcion;
            document.getElementById('tarea_fecha_limite').value = tarea.fecha_limite;
            document.getElementById('tarea_prioridad').value = tarea.prioridad;
            
            tareaModal.show();
        }
    }

    function eliminarTarea(id) {
        if (confirm('¿Estás seguro de eliminar esta tarea?')) {
            fetch(`api/tareas.php?id=${id}`, {method: 'DELETE'})
                .then(response => response.json())
                .then(data => cargarTareas(listaActual));
        }
    }

    function actualizarEstadoTarea(id, completada) {
        fetch('api/tareas.php', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id, completada})
        })
        .then(response => response.json())
        .then(data => cargarTareas(listaActual));
    }

    // Funciones de carga
    function cargarListas() {
        fetch('api/listas.php')
            .then(response => response.json())
            .then(listas => {
                const container = document.getElementById('lista-todo');
                container.innerHTML = '';
                listas.forEach(lista => {
                    container.innerHTML += `
                        <div class="lista-item" data-id="${lista.id}" style="background-color: ${lista.color}">
                            <span class="lista-nombre" style="color: white">${lista.nombre}</span>
                            <div class="lista-acciones">
                                <button class="btn btn-sm btn-editar" title="Editar">✏️</button>
                                <button class="btn btn-sm btn-eliminar" title="Eliminar">🗑️</button>
                            </div>
                        </div>
                    `;
                });
                agregarEventListeners();
            });
    }

    function cargarTareas(listaId) {
        if (!listaId) return;
        fetch(`api/tareas.php?lista_id=${listaId}`)
            .then(response => response.json())
            .then(tareas => {
                const container = document.getElementById('tareas-container');
                container.innerHTML = '';
                tareas.forEach(tarea => {
                    container.innerHTML += `
                        <div class="tarea-item ${tarea.completada ? 'tarea-completada' : ''} prioridad-${tarea.prioridad}" data-id="${tarea.id}">
                            <input type="checkbox" class="form-check-input me-2" ${tarea.completada ? 'checked' : ''}>
                            <div class="tarea-contenido flex-grow-1">
                                <h5 class="mb-1">${tarea.titulo}</h5>
                                <p class="mb-1">${tarea.descripcion || ''}</p>
                                ${tarea.fecha_limite ? `<small class="text-muted">Fecha límite: ${tarea.fecha_limite}</small>` : ''}
                            </div>
                            <div class="tarea-acciones">
                                <button class="btn btn-sm btn-editar">✏️</button>
                                <button class="btn btn-sm btn-eliminar">🗑️</button>
                            </div>
                        </div>
                    `;
                });
                agregarEventListenersTareas();
            });
    }
});
