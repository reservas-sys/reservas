/* ==========================================
   TRANQUILLUM CORE - SYSTEM V1.0
   ========================================== */

// --- CONFIGURACIÓN FIREBASE (Pon la de Viventura cuando esté lista) ---
// Por ahora usaremos autenticación simulada para que avances.
const auth = null; // Simulamos auth local por ahora

// --- DATOS SIMULADOS (BASE DE DATOS INMORTAL) ---
const DB_CLIENTES = [
    { id: 101, nombre: "Juan Pérez", destino: "Punta Cana", fecha: "15/02/2026", estado: "paz_salvo", asesor: "Katherine", foto: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 102, nombre: "Maria Gomez", destino: "Cancún", fecha: "20/03/2026", estado: "pendiente", asesor: "Daniela", foto: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 103, nombre: "Carlos Ruiz", destino: "San Andrés", fecha: "10/01/2026", estado: "mora", asesor: "Valentina", foto: "https://randomuser.me/api/portraits/men/85.jpg" }
];

// --- ELEMENTOS DOM ---
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const mainApp = document.getElementById('main-app');
const workspace = document.getElementById('workspace');
const titleView = document.getElementById('current-view-title');

// --- SISTEMA DE LOGIN ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username-input').value;
    const pass = document.getElementById('password-input').value;

    // Validación simulada (luego conectamos Firebase)
    if(pass === '123' || pass === 'HOLA') {
        loginOverlay.style.display = 'none';
        mainApp.style.display = 'flex';
        document.getElementById('user-name-display').textContent = user.toUpperCase();
        document.getElementById('user-initials').textContent = user.substring(0,2).toUpperCase();
        loadView('home'); // Cargar inicio
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    location.reload(); // Recargar para salir
});

// --- ENRUTADOR DE VISTAS ---
window.loadView = function(viewName) {
    // 1. Actualizar menú activo
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    // (Aquí podrías añadir lógica para marcar el botón activo)

    // 2. Renderizar contenido
    workspace.innerHTML = ''; // Limpiar área

    switch(viewName) {
        case 'home':
            titleView.textContent = "Resumen Operativo";
            renderDashboard();
            break;
        case 'crm':
            titleView.textContent = "Gestión de Clientes (CRM)";
            renderCRM();
            break;
        case 'quotes':
            titleView.textContent = "Generador de Cotizaciones";
            renderTool('cotizador');
            break;
        case 'confirms':
            titleView.textContent = "Generador de Confirmaciones";
            renderTool('confirmador');
            break;
    }
}

// --- VISTA 1: DASHBOARD (HOME) ---
function renderDashboard() {
    workspace.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <img src="https://i.imgur.com/GiTvvrW.png" width="200" style="margin-bottom:20px; filter: grayscale(100%); opacity:0.5;">
            <h3>¡Bienvenido a Tranquillum!</h3>
            <p style="color:#666;">Selecciona un módulo en el menú izquierdo para comenzar.</p>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px; margin-top:40px;">
                <div class="client-card" style="background:#fff7ed; border-color: #FE8050;">
                    <h4>🔥 Tareas Críticas</h4>
                    <p style="font-size:2rem; font-weight:bold; color:#FE8050;">3</p>
                    <small>Vencen hoy</small>
                </div>
                <div class="client-card" style="background:#ecfdf5; border-color: #22c55e;">
                    <h4>✈️ Viajan esta semana</h4>
                    <p style="font-size:2rem; font-weight:bold; color:#22c55e;">8</p>
                    <small>Todo listo</small>
                </div>
                <div class="client-card" style="background:#f0f9ff; border-color: #14A7CA;">
                    <h4>💰 Recaudo Mes</h4>
                    <p style="font-size:2rem; font-weight:bold; color:#14A7CA;">$ 45M</p>
                    <small>Meta: $ 60M</small>
                </div>
            </div>
        </div>
    `;
}

// --- VISTA 2: CRM (CLIENTES) ---
function renderCRM() {
    // Barra de búsqueda
    let html = `
        <div class="search-bar-container">
            <i class="fas fa-search" style="color:#94a3b8; padding-top:12px;"></i>
            <input type="text" class="search-input" placeholder="Buscar por Nombre, Cédula, Destino o Asesor...">
            <button class="btn-primary-v">Filtrar</button>
        </div>
        
        <div class="clients-grid">
    `;

    // Renderizar tarjetas de clientes simulados
    DB_CLIENTES.forEach(cliente => {
        let badgeClass = 'status-ok';
        let badgeText = 'PAZ Y SALVO';
        if(cliente.estado === 'pendiente') { badgeClass = 'status-alert'; badgeText = 'PENDIENTE PAGO'; }
        if(cliente.estado === 'mora') { badgeClass = 'status-danger'; badgeText = 'PAGO VENCIDO'; }

        html += `
            <div class="client-card">
                <span class="status-badge ${badgeClass}">${badgeText}</span>
                <div class="client-header">
                    <img src="${cliente.foto}" class="client-photo">
                    <div class="client-info">
                        <h4>${cliente.nombre}</h4>
                        <span>Asesor: ${cliente.asesor}</span>
                    </div>
                </div>
                <div class="client-stats">
                    <div class="stat"><strong>Destino</strong>${cliente.destino}</div>
                    <div class="stat"><strong>Fecha</strong>${cliente.fecha}</div>
                </div>
                <div class="client-actions">
                    <button class="btn-icon"><i class="fas fa-eye"></i> Ver</button>
                    <button class="btn-icon"><i class="fas fa-file-pdf"></i> Docs</button>
                    <button class="btn-icon" style="color:#25D366;"><i class="fab fa-whatsapp"></i></button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    workspace.innerHTML = html;
}

// --- VISTA 3: HERRAMIENTAS (IFRAMES O CÓDIGO INYECTADO) ---
function renderTool(toolName) {
    // Aquí es donde integraremos tus códigos anteriores.
    // Por ahora pondré un placeholder visual.
    workspace.innerHTML = `
        <div class="embedded-tool" style="padding:40px; text-align:center;">
            <h3>Cargando herramienta: ${toolName.toUpperCase()}...</h3>
            <p>Aquí se mostrará el formulario de ${toolName} tal como lo diseñamos.</p>
            <br>
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem; border: 4px solid #eee; border-top-color: #FE8050; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
    `;
    
    // NOTA: En el siguiente paso, copiaremos y pegaremos aquí el HTML 
    // de los formularios de Cotizador y Confirmador para que aparezcan dentro.
}

// Inicialización de Mapas (Dummy para que no de error)
function initApp() {
    console.log("Google Maps Cargado");
}
