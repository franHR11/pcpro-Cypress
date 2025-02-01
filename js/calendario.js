// Definir calendar como variable global
let calendar;

document.addEventListener('DOMContentLoaded', function() {
    const eventoModal = new bootstrap.Modal(document.getElementById('eventoModal'));
    const calendarioModal = new bootstrap.Modal(document.getElementById('calendarioModal'));
    
    // Inicializar Set global para calendarios visibles
    window.calendariosVisibles = new Set();

    // Obtener eventos del servidor
    function obtenerEventos(fetchInfo, successCallback, failureCallback) {
        fetch('./api/eventos.php')
            .then(response => response.json())
            .then(eventos => {
                const eventosFormateados = eventos.map(evento => ({
                    id: evento.id,
                    title: evento.titulo,
                    start: evento.fecha_inicio,
                    end: evento.fecha_fin,
                    description: evento.descripcion,
                    backgroundColor: evento.calendario_color,
                    display: 'auto',
                    extendedProps: {
                        descripcion: evento.descripcion,
                        calendario_id: evento.calendario_id,
                        calendario_nombre: evento.calendario_nombre,
                        recurrencia: evento.recurrencia,
                        recurrencia_fin: evento.recurrencia_fin
                    }
                }));
                successCallback(eventosFormateados);
            })
            .catch(error => failureCallback(error));
    }

    // Inicializar calendario
    calendar = new FullCalendar.Calendar(document.getElementById('calendario'), {
        initialView: 'dayGridMonth',
        locale: 'es',
        firstDay: 1, // 1 = Lunes (0 sería Domingo)
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        allDaySlot: false, // Eliminar la sección "Todo el día"
        slotDuration: '00:30:00', // Intervalo de 30 minutos
        slotLabelInterval: '00:30', // Etiquetas de intervalo de 30 minutos
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Formato 24 horas
        },
        slotLabelClassNames: 'fc-timegrid-slot-label', // Añadir clase personalizada
        dayHeaderFormat: {
            weekday: 'long' // Nombre completo del día
        },
        dayHeaderClassNames: 'calendario-header-dia',
        slotMinTime: '00:00:00', // Hora mínima
        slotMaxTime: '24:00:00', // Hora máxima
        height: 'auto', // Ajustar altura automáticamente
        contentHeight: 'auto', // Ajustar altura del contenido automáticamente
        slotLabelClassNames: 'fc-timegrid-slot-label', // Añadir clase personalizada
        dayHeaderFormat: {
            weekday: 'long' // Nombre completo del día
        },
        dayHeaderClassNames: 'calendario-header-dia',
        selectable: true,
        editable: true, // Permite arrastrar eventos
        eventDisplay: 'block', // Forzar display tipo bloque para todos los eventos
        eventClassNames: 'fc-daygrid-block-event', // Forzar clase de bloque
        displayEventTime: true, // Muestra la hora
        displayEventEnd: true, // Muestra hora de fin
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
        },
        eventContent: function(arg) {
            return {
                html: `
                    <div class="fc-event-main-content">
                        <div class="fc-event-title">${arg.event.title}</div>
                        ${arg.timeText ? `<div class="fc-event-time">${arg.timeText}</div>` : ''}
                    </div>
                `
            };
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            fetch('./api/eventos.php')
                .then(response => {
                    if (!response.ok) throw new Error('Error en la respuesta del servidor');
                    return response.json();
                })
                .then(eventos => {
                    const allEvents = [];
                    eventos.forEach(evento => {
                        // Parsear los días de la semana desde JSON
                        evento.dias_semana = evento.dias_semana ? JSON.parse(evento.dias_semana) : [];
                        
                        // Si tiene recurrencia y días seleccionados, generar eventos recurrentes
                        if (evento.recurrencia !== 'none' && evento.dias_semana.length > 0 && evento.recurrencia_fin) {
                            const eventosRecurrentes = generarEventosRecurrentes(evento);
                            eventosRecurrentes.forEach(evt => {
                                allEvents.push({
                                    ...evt,
                                    backgroundColor: evento.calendario_color,
                                    borderColor: evento.calendario_color,
                                    textColor: '#ffffff',
                                    display: window.calendariosVisibles.has(evento.calendario_id.toString()) ? 'auto' : 'none',
                                    className: 'fc-daygrid-block-event' // Forzar clase de bloque
                                });
                            });
                        } else {
                            // Si el evento empieza y termina en el mismo instante, agregar un minuto de duración
                            let fechaFin = evento.fecha_fin;
                            if (evento.fecha_inicio === evento.fecha_fin) {
                                const d = new Date(evento.fecha_fin);
                                d.setMinutes(d.getMinutes() + 1);
                                fechaFin = d.toISOString();
                            }
                            // Evento normal sin recurrencia
                            allEvents.push({
                                id: evento.id,
                                title: evento.titulo,
                                start: evento.fecha_inicio,
                                end: fechaFin,
                                backgroundColor: evento.calendario_color,
                                borderColor: evento.calendario_color,
                                textColor: '#ffffff',
                                allDay: false,  // Forzar que el evento no sea considerado "allDay"
                                display: window.calendariosVisibles.has(evento.calendario_id.toString()) ? 'auto' : 'none',
                                className: 'fc-daygrid-block-event', // Forzar clase de bloque
                                extendedProps: {
                                    descripcion: evento.descripcion,
                                    calendario_id: evento.calendario_id,
                                    calendario_nombre: evento.calendario_nombre,
                                    recurrencia: evento.recurrencia,
                                    recurrencia_fin: evento.recurrencia_fin,
                                    dias_semana: evento.dias_semana
                                }
                            });
                        }
                    });
                    successCallback(allEvents);
                })
                .catch(error => {
                    console.error('Error al cargar eventos:', error);
                    failureCallback(error);
                });
        },
        select: function(info) {
            prepararModal('nuevo', info);
            eventoModal.show();
        },
        eventClick: function(info) {
            prepararModal('editar', info.event);
            eventoModal.show();
        },
        eventDidMount: function(info) {
            // Forzar estilo de bloque para eventos de un solo día
            if (info.event.start?.toDateString() === info.event.end?.toDateString()) {
                info.el.classList.add('fc-daygrid-block-event');
                info.el.style.backgroundColor = info.event.backgroundColor;
                info.el.style.borderColor = info.event.borderColor;
            }
            
            // Verificar si el calendario está visible
            const calId = info.event.extendedProps.calendario_id.toString();
            if (!window.calendariosVisibles.has(calId)) {
                info.event.setProp('display', 'none');
            }
        },
        viewDidMount: function(view) {
            // Añadir título "Horas" en la columna de horas
            const timeGridAxis = document.querySelector('.fc-timegrid-axis');
            if (timeGridAxis) {
                const header = document.createElement('div');
                header.className = 'fc-timegrid-axis-header';
                header.innerText = 'Horas';
                timeGridAxis.insertBefore(header, timeGridAxis.firstChild);
            }
        },
        views: {
            dayGridMonth: {
                dayMaxEventRows: true,
                dayMaxEvents: true,
                eventDisplay: 'block',
                eventClassNames: ['fc-daygrid-block-event']
            }
        }
    });
    
    calendar.render();
    cargarCalendarios();
    
    // Botón nuevo calendario
    document.getElementById('nuevo-calendario').addEventListener('click', function() {
        calendarioModal.show();
    });
    
    // Guardar nuevo calendario
    document.getElementById('guardar-calendario').addEventListener('click', function() {
        // Utilizar el input hidden para determinar si es edición o creación
        const id = document.getElementById('calendario_id_hidden').value;
        const formData = {
            id: id, 
            nombre: document.getElementById('calendario_nombre').value,
            color: document.getElementById('calendario_color').value
        };
        
        fetch('api/calendarios.php', {
            method: id ? 'PUT' : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            const calendarioModal = bootstrap.Modal.getInstance(document.getElementById('calendarioModal'));
            calendarioModal.hide();
            cargarCalendarios();
            // Reiniciar el formulario incluyendo el hidden
            document.getElementById('calendarioForm').reset();
            document.getElementById('calendario_id_hidden').value = '';
        });
    });

    // Mostrar/ocultar selector de fecha fin recurrencia
    document.getElementById('recurrencia').addEventListener('change', function(e) {
        const container = document.getElementById('recurrencia_fin_container');
        container.style.display = e.target.value === 'none' ? 'none' : 'block';
    });
    
    // Guardar evento
    document.getElementById('guardar-evento').addEventListener('click', function() {
        if (!document.getElementById('eventoForm').checkValidity()) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        const calendarioSelect = document.getElementById('calendario_id');
        const selectedCalendario = calendarioSelect.options[calendarioSelect.selectedIndex];
        const calendarioColor = selectedCalendario.getAttribute('data-color');

        const formData = {
            id: document.getElementById('evento_id').value,
            titulo: document.getElementById('titulo').value,
            descripcion: document.getElementById('descripcion').value,
            fecha_inicio: document.getElementById('fecha_inicio').value,
            fecha_fin: document.getElementById('fecha_fin').value,
            calendario_id: calendarioSelect.value,
            recurrencia: document.getElementById('recurrencia').value,
            recurrencia_fin: document.getElementById('recurrencia_fin').value || null,
            dias_semana: Array.from(document.querySelectorAll('input[name="dias_semana"]:checked')).map(el => el.value),
            calendario_color: calendarioColor
        };

        // Extraer color del calendario desde el option seleccionado
        const select = document.getElementById('calendario_id');
        const selectedOption = select.options[select.selectedIndex];
        formData.calendario_color = selectedOption ? selectedOption.getAttribute('data-color') : '#3788d8';

        // Depuración: Verificar los datos enviados
        console.log('Datos enviados:', formData);
        console.log('Comprobación dias_semana:', formData.dias_semana);

        fetch('./api/eventos.php', {
            method: formData.id ? 'PUT' : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            eventoModal.hide();
            calendar.refetchEvents(); // Recargar eventos
            document.getElementById('eventoForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al guardar el evento');
        });
    });

    // Eliminar evento
    document.getElementById('eliminar-evento').addEventListener('click', function() {
        const eventoId = document.getElementById('evento_id').value;
        if (eventoId && confirm('¿Estás seguro de eliminar este evento?')) {
            eliminarEvento(eventoId);
        }
    });
});

// Mover las funciones auxiliares al scope global
function cargarCalendarios() {
    fetch('api/calendarios.php')
        .then(response => response.json())
        .then(calendarios => {
            const lista = document.getElementById('lista-calendarios');
            const select = document.getElementById('calendario_id');
            
            lista.innerHTML = '';
            select.innerHTML = '';
            
            // Por defecto todos los calendarios están visibles
            window.calendariosVisibles.clear();
            calendarios.forEach(cal => {
                const calId = cal.id.toString();
                window.calendariosVisibles.add(calId); // Añadir todos por defecto
                
                // Verificar estado guardado
                const estadoGuardado = localStorage.getItem(`cal_visible_${calId}`);
                if (estadoGuardado === 'false') {
                    window.calendariosVisibles.delete(calId);
                }

                // Agregar a la lista de calendarios
                lista.innerHTML += `
                    <div class="calendario-item" data-id="${calId}" style="background-color: ${cal.color}">
                        <input type="checkbox" class="calendario-visible" 
                               id="cal-${calId}" 
                               ${estadoGuardado !== 'false' ? 'checked' : ''}>
                        <label class="calendario-nombre" for="cal-${calId}" style="color: white">
                            ${cal.nombre}
                        </label>
                        <div class="calendario-acciones">
                            <button class="btn btn-sm btn-editar" title="Editar">✏️</button>
                            <button class="btn btn-sm btn-eliminar" title="Eliminar">🗑️</button>
                        </div>
                    </div>
                `;
                
                // Agregar la opción del select con data-color
                select.innerHTML += `<option value="${calId}" data-color="${cal.color}">${cal.nombre}</option>`;
            });

            // Event listeners para los checkboxes
            document.querySelectorAll('.calendario-visible').forEach(checkbox => {
                const calId = checkbox.closest('.calendario-item').dataset.id;
                
                checkbox.addEventListener('change', function(e) {
                    const isChecked = e.target.checked;
                    localStorage.setItem(`cal_visible_${calId}`, isChecked);
                    
                    if (isChecked) {
                        window.calendariosVisibles.add(calId);
                    } else {
                        window.calendariosVisibles.delete(calId);
                    }
                    
                    actualizarEventosVisibles();
                });
            });

            // Añadir event listeners y cargar estados guardados
            document.querySelectorAll('.calendario-item').forEach(item => {
                const calId = item.dataset.id;
                const checkbox = item.querySelector('.calendario-visible');

                // Restaurar estado guardado
                const estado = localStorage.getItem(`cal_visible_${calId}`);
                if (estado === 'false') {
                    checkbox.checked = false;
                    ocultarEventosCalendario(calId);
                }

                // Event listener para checkbox
                checkbox.addEventListener('change', function(e) {
                    localStorage.setItem(`cal_visible_${calId}`, e.target.checked);
                    if (e.target.checked) {
                        mostrarEventosCalendario(calId);
                    } else {
                        ocultarEventosCalendario(calId);
                    }
                });

                // Botón editar
                item.querySelector('.btn-editar').addEventListener('click', function() {
                    editarCalendario(calId);
                });

                // Botón eliminar
                item.querySelector('.btn-eliminar').addEventListener('click', function() {
                    if (confirm('¿Estás seguro de eliminar este calendario?')) {
                        eliminarCalendario(calId);
                    }
                });
            });

            // Actualizar eventos después de cargar calendarios
            actualizarEventosVisibles();
        });
}

function prepararModal(tipo, info) {
    const form = document.getElementById('eventoForm');
    form.reset();
    
    if (tipo === 'nuevo') {
        document.getElementById('evento_id').value = '';
        document.getElementById('fecha_inicio').value = info.startStr;
        document.getElementById('fecha_fin').value = info.endStr;
        document.getElementById('eliminar-evento').style.display = 'none'; // Ocultar botón de eliminar
    } else {
        document.getElementById('evento_id').value = info.id;
        document.getElementById('titulo').value = info.title;
        document.getElementById('descripcion').value = info.extendedProps.descripcion;
        document.getElementById('fecha_inicio').value = info.start;
        document.getElementById('fecha_fin').value = info.end;
        document.getElementById('calendario_id').value = info.extendedProps.calendario_id;
        document.getElementById('recurrencia').value = info.extendedProps.recurrencia;
        // Añadir color del calendario al evento
        document.getElementById('calendario_color').value = info.backgroundColor;
        document.getElementById('eliminar-evento').style.display = 'block'; // Mostrar botón de eliminar
    }
    
    // Añadir checkboxes para los días de la semana
    const diasSemanaContainer = document.getElementById('dias_semana_container');
    if (diasSemanaContainer) {
        diasSemanaContainer.innerHTML = `
            <label><input type="checkbox" name="dias_semana" value="L"> L</label>
            <label><input type="checkbox" name="dias_semana" value="M"> M</label>
            <label><input type="checkbox" name="dias_semana" value="X"> X</label>
            <label><input type="checkbox" name="dias_semana" value="J"> J</label>
            <label><input type="checkbox" name="dias_semana" value="V"> V</label>
            <label><input type="checkbox" name="dias_semana" value="S"> S</label>
            <label><input type="checkbox" name="dias_semana" value="D"> D</label>
        `;
    } else {
        console.error('El contenedor de días de la semana no se encontró en el DOM.');
    }
}

function editarCalendario(id) {
    fetch(`api/calendarios.php?id=${id}`)
        .then(response => response.json())
        .then(calendario => {
            // Llenar el campo hidden para saber que se está editando
            document.getElementById('calendario_id_hidden').value = calendario.id;
            document.getElementById('calendario_nombre').value = calendario.nombre;
            document.getElementById('calendario_color').value = calendario.color;
            const calendarioModal = bootstrap.Modal.getInstance(document.getElementById('calendarioModal'));
            calendarioModal.show();
        });
}

function eliminarCalendario(id) {
    fetch(`api/calendarios.php?id=${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cargarCalendarios();
            calendar.refetchEvents();
        }
    });
}

function eliminarEvento(id) {
    fetch(`./api/eventos.php?id=${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            calendar.refetchEvents(); // Recargar eventos
            const eventoModal = bootstrap.Modal.getInstance(document.getElementById('eventoModal'));
            eventoModal.hide(); // Ocultar modal
        } else {
            alert('Error al eliminar el evento');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el evento');
    });
}

function generarEventosRecurrentes(evento) {
    const eventos = [];
    const inicio = new Date(evento.fecha_inicio);
    const fin = new Date(evento.fecha_fin);
    const finRecurrencia = new Date(evento.recurrencia_fin);
    const duracion = fin.getTime() - inicio.getTime();
    const mapDias = { 'D': 0, 'L': 1, 'M': 2, 'X': 3, 'J': 4, 'V': 5, 'S': 6 };

    let fechaActual = new Date(inicio);
    while (fechaActual <= finRecurrencia) {
        const diaActual = fechaActual.getDay();
        if (evento.dias_semana.some(d => mapDias[d] === diaActual)) {
            const fechaFinEvento = new Date(fechaActual.getTime() + duracion);
            eventos.push({
                id: `${evento.id}-${fechaActual.getTime()}`,
                title: evento.titulo,
                start: fechaActual.toISOString(),
                end: fechaFinEvento.toISOString(),
                backgroundColor: evento.calendario_color,
                borderColor: evento.calendario_color,
                textColor: '#ffffff',
                allDay: false,  // Forzar que el evento recurrente no sea "allDay"
                extendedProps: {
                    descripcion: evento.descripcion,
                    calendario_id: evento.calendario_id,
                    calendario_nombre: evento.calendario_nombre,
                    recurrencia: evento.recurrencia,
                    dias_semana: evento.dias_semana,
                    calendario_color: evento.calendario_color
                }
            });
        }
        fechaActual.setDate(fechaActual.getDate() + 1);
    }
    return eventos;
}

// Función para actualizar eventos
window.actualizarEventosVisibles = function() {
    const eventos = calendar.getEvents();
    eventos.forEach(evento => {
        const calId = evento.extendedProps.calendario_id.toString();
        const display = window.calendariosVisibles.has(calId) ? 'auto' : 'none';
        evento.setProp('display', display);
    });
};
