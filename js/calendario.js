// Definir variables globales
let calendar;
let eventoModal;
let calendarioModal; // Añadir esta variable global

document.addEventListener('DOMContentLoaded', function() {
    eventoModal = new bootstrap.Modal(document.getElementById('eventoModal'), {
        backdrop: 'static',
        keyboard: false,
        focus: true
    });
    calendarioModal = new bootstrap.Modal(document.getElementById('calendarioModal'), {
        backdrop: 'static',
        keyboard: false,
        focus: true
    });

    // Inicializar Set global para calendarios visibles
    window.calendariosVisibles = new Set();

    // Agregar la función formatearFechaLocal antes de la inicialización del calendario
    function formatearFechaLocal(fecha) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const hours = String(fecha.getHours()).padStart(2, '0');
        const minutes = String(fecha.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Inicializar calendario
    calendar = new FullCalendar.Calendar(document.getElementById('calendario'), {
        initialView: 'dayGridMonth',
        locale: 'es',
        firstDay: 1, // 1 = Lunes (0 sería Domingo)
        nowIndicator: true, // Añadir el indicador de hora actual
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
        dayHeaderFormat: {
            weekday: 'long',
            day: 'numeric',
            omitCommas: true
        },
        views: {
            timeGridWeek: {
                dayHeaderFormat: {
                    weekday: 'long',
                    day: 'numeric',
                    omitCommas: true
                },
                nowIndicator: true // Asegurar que el indicador aparezca en vista semana
            },
            timeGridDay: {
                dayHeaderFormat: {
                    weekday: 'long',
                    day: 'numeric',
                    omitCommas: true
                },
                nowIndicator: true // Asegurar que el indicador aparezca en vista día
            }
        },
        dayHeaderClassNames: 'calendario-header-dia',
        slotMinTime: '00:00:00', // Hora mínima
        slotMaxTime: '24:00:00', // Hora máxima
        height: 'auto', // Ajustar altura automáticamente
        contentHeight: 'auto', // Ajustar altura del contenido automáticamente
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

                        // Si el evento empieza y termina en el mismo instante, agregar un minuto de duración
                        let fechaFin = evento.fecha_fin;
                        if (evento.fecha_inicio === evento.fecha_fin) {
                            const d = new Date(evento.fecha_fin);
                            d.setMinutes(d.getMinutes() + 1);
                            fechaFin = d.toISOString();
                        }

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
                            // Evento normal sin recurrencia
                            allEvents.push({
                                id: evento.id,
                                title: evento.titulo,
                                start: evento.fecha_inicio,
                                end: fechaFin, // Usar la fecha ajustada
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
            // Crear fechas en zona horaria local
            const fechaInicio = new Date(info.start.getTime());
            const fechaFin = new Date(info.start.getTime());
            
            // Ajustar horas manteniendo la zona horaria local
            fechaInicio.setHours(0, 0, 0, 0);
            fechaFin.setHours(0, 1, 0, 0);

            const nuevoEvento = {
                start: fechaInicio,
                end: fechaFin,
                // Usar formatearFecha directamente
                startStr: formatearFecha(fechaInicio),
                endStr: formatearFecha(fechaFin)
            };

            console.log('Fechas del evento:', {
                inicio: nuevoEvento.startStr,
                fin: nuevoEvento.endStr
            });
            
            prepararModal('nuevo', nuevoEvento);
            eventoModal.show();
        },
        eventClick: function(info) {
            prepararModal('editar', info.event);
            eventoModal.show();
        },
        eventDidMount: function(info) {
            // Verificar si el calendario está visible
            const calId = info.event.extendedProps.calendario_id.toString();
            if (!window.calendariosVisibles.has(calId)) {
                info.event.setProp('display', 'none');
            }

            // Forzar el color en la vista de mes para eventos de un solo día
            if (info.view.type === 'dayGridMonth' && info.event.start && info.event.end && info.event.start.getTime() === info.event.end.getTime()) {
                info.el.style.backgroundColor = info.event.backgroundColor;
                info.el.style.borderColor = info.event.borderColor;
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
        // Modificar el manejador dateClick
        dateClick: function(info) {
            // Convert the clicked date to the local timezone
            const fecha = new Date(info.date);
            const fechaInicio = new Date(fecha.setHours(0, 0, 0, 0)); // Start of the day
            const fechaFin = new Date(fecha.setHours(23, 59, 59, 999)); // End of the day

            // Format the dates for the input fields
            const fechaInicioStr = formatearFechaLocal(fechaInicio);
            const fechaFinStr = formatearFechaLocal(fechaFin);

            // Set the values in the modal inputs
            document.getElementById('fecha_inicio').value = fechaInicioStr;
            document.getElementById('fecha_fin').value = fechaFinStr;

            // Prepare the modal for a new event
            prepararModal('nuevo', {
                startStr: fechaInicioStr,
                endStr: fechaFinStr
            });

            // Show the modal
            eventoModal.show();
        }
    });

    calendar.render();
    cargarCalendarios();

    // Botón nuevo calendario
    document.getElementById('nuevo-calendario').addEventListener('click', function() {
        document.querySelector('#calendarioModal .modal-title').textContent = 'Nuevo Calendario';
        document.getElementById('calendario_id_hidden').value = '';
        document.getElementById('calendario_nombre').value = '';
        document.getElementById('calendario_color').value = '#3788d8';
        calendarioModal.show();
    });

    // Guardar nuevo calendario
    document.getElementById('guardar-calendario').addEventListener('click', function() {
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

        fetch('./api/eventos.php', {
            method: formData.id ? 'PUT' : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return response.json();
        })
        .then(data => {
            eventoModal.hide();
            calendar.refetchEvents();
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

    // Agregar manejadores de eventos para el modal
    document.getElementById('calendarioModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('calendario_nombre').focus();
    });

    document.getElementById('eventoModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('titulo').focus();
    });

    // Modificar el cierre de los modales
    document.getElementById('calendarioModal').addEventListener('hide.bs.modal', function () {
        document.getElementById('calendarioForm').reset();
        document.getElementById('calendario_id_hidden').value = '';
    });

    document.getElementById('eventoModal').addEventListener('hide.bs.modal', function () {
        document.getElementById('eventoForm').reset();
    });
});

// Función para cargar calendarios
function cargarCalendarios() {
    fetch('api/calendarios.php')
        .then(response => response.json())
        .then(calendarios => {
            const lista = document.getElementById('lista-calendarios');
            const select = document.getElementById('calendario_id');

            lista.innerHTML = '';
            select.innerHTML = '';

            window.calendariosVisibles.clear();
            calendarios.forEach(cal => {
                const calId = cal.id.toString();
                window.calendariosVisibles.add(calId);

                const estadoGuardado = localStorage.getItem(`cal_visible_${calId}`);
                if (estadoGuardado === 'false') {
                    window.calendariosVisibles.delete(calId);
                }

                lista.innerHTML += `
                    <div class="calendario-item" data-id="${calId}" style="background-color: ${cal.color}">
                        <input type="checkbox" class="calendario-visible" 
                               id="cal-${calId}" 
                               ${estadoGuardado !== 'false' ? 'checked' : ''}>
                        <label class="calendario-nombre" for="cal-${calId}" style="color: white">
                            ${cal.nombre}
                        </label>
                        <div class="calendario-acciones">
                            <button class="btn btn-sm btn-editar" title="Editar" data-id="${calId}" data-nombre="${cal.nombre}" data-color="${cal.color}">✏️</button>
                            <button class="btn btn-sm btn-eliminar" title="Eliminar" data-id="${calId}">🗑️</button>
                        </div>
                    </div>
                `;

                select.innerHTML += `<option value="${calId}" data-color="${cal.color}">${cal.nombre}</option>`;
            });

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

            // Añadir manejadores para los botones de editar y eliminar
            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.getElementById('calendario_id_hidden').value = this.dataset.id;
                    document.getElementById('calendario_nombre').value = this.dataset.nombre;
                    document.getElementById('calendario_color').value = this.dataset.color;
                    // Cambiar el título del modal para edición
                    document.querySelector('#calendarioModal .modal-title').textContent = 'Editar Calendario';
                    calendarioModal.show();
                });
            });

            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', function() {
                    const calId = this.dataset.id;
                    if (confirm('¿Estás seguro de eliminar este calendario? Se eliminarán todos los eventos asociados.')) {
                        eliminarCalendario(calId);
                    }
                });
            });

            actualizarEventosVisibles();
        });
}

// Añadir esta nueva función para eliminar calendarios
function eliminarCalendario(calId) {
    fetch(`api/calendarios.php?id=${calId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        cargarCalendarios();
        calendar.refetchEvents();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el calendario');
    });
}

// Función para preparar el modal de eventos
function prepararModal(tipo, info) {
    const form = document.getElementById('eventoForm');
    form.reset();

    if (tipo === 'nuevo') {
        document.getElementById('evento_id').value = '';
        document.getElementById('fecha_inicio').value = info.startStr;
        document.getElementById('fecha_fin').value = info.endStr;
        document.getElementById('eliminar-evento').style.display = 'none';
    } else {
        document.getElementById('evento_id').value = info.id;
        document.getElementById('titulo').value = info.title;
        document.getElementById('descripcion').value = info.extendedProps.descripcion;
        document.getElementById('fecha_inicio').value = formatearFecha(info.start);
        document.getElementById('fecha_fin').value = formatearFecha(info.end);
        document.getElementById('calendario_id').value = info.extendedProps.calendario_id;
        document.getElementById('recurrencia').value = info.extendedProps.recurrencia || 'none';
        
        // Mostrar u ocultar el campo de fecha fin de recurrencia según corresponda
        const recurrenciaFinContainer = document.getElementById('recurrencia_fin_container');
        recurrenciaFinContainer.style.display = info.extendedProps.recurrencia !== 'none' ? 'block' : 'none';
        
        // Establecer la fecha de fin de recurrencia si existe
        if (info.extendedProps.recurrencia_fin) {
            document.getElementById('recurrencia_fin').value = formatearFecha(new Date(info.extendedProps.recurrencia_fin));
        }
        
        document.getElementById('eliminar-evento').style.display = 'block';
    }

    // Configurar los checkboxes de días de la semana
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

        // Marcar los días de la semana previamente seleccionados
        if (tipo === 'editar' && info.extendedProps.dias_semana) {
            const diasSeleccionados = info.extendedProps.dias_semana;
            const checkboxes = diasSemanaContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (diasSeleccionados.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
    }
}

// Función auxiliar para formatear fechas
function formatearFecha(fecha) {
    if (!fecha) return '';
    const d = new Date(fecha);
    
    // Crear string en formato YYYY-MM-DDTHH:mm
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Agregar nueva función para formatear fechas en zona horaria local
function formatearFechaLocal(fecha) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Función para generar eventos recurrentes
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
                allDay: false,
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

// Función para actualizar eventos visibles
window.actualizarEventosVisibles = function() {
    const eventos = calendar.getEvents();
    eventos.forEach(evento => {
        const calId = evento.extendedProps.calendario_id.toString();
        const display = window.calendariosVisibles.has(calId) ? 'auto' : 'none';
        evento.setProp('display', display);
    });

};
// Función para eliminar eventos
function eliminarEvento(eventoId) {
    fetch(`./api/eventos.php?id=${eventoId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al eliminar el evento');
        return response.json();
    })
    .then(data => {
        const evento = calendar.getEventById(eventoId);
        if (evento) {
            evento.remove();
        }
        eventoModal.hide();
        calendar.refetchEvents();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el evento');
    });
}