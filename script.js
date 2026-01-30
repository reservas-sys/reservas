/* ==========================================
   TRANQUILLUM CORE - VIVANTURA SYSTEM V3.0
   (Módulo CRM + Navegación)
   ========================================== */

// 1. CONFIGURACIÓN FIREBASE (Tranquillium)
const firebaseConfig = {
    apiKey: "AIzaSyD6II6k1Y4_bpzeH45hj_7-nQpxYmbP0wE",
    authDomain: "tranquillium-32bb8.firebaseapp.com",
    projectId: "tranquillium-32bb8",
    storageBucket: "tranquillium-32bb8.firebasestorage.app",
    messagingSenderId: "478019073507",
    appId: "1:478019073507:web:740e0b826d7881729c1cd6"
};

// Inicialización Segura
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;

// ==========================================
// BASE DE DATOS SIMULADA (PARA VISUALIZACIÓN)
// ==========================================
// Aquí simulamos cómo se verán los clientes cuando los traigamos de Firebase
let DB_CLIENTES = [
    { 
        id: 1, 
        nombre: "Juan Pérez & Familia", 
        destino: "Punta Cana", 
        fecha_viaje: "2026-03-15", 
        estado_pago: "aldia", // aldia, pendiente, mora
        asesor: "Katherine",
        foto: "https://randomuser.me/api/portraits/men/32.jpg", // Foto Ritual Simulada
        saldo: 0
    },
    { 
        id: 2, 
        nombre: "Ana María López", 
        destino: "Cancún", 
        fecha_viaje: "2026-04-20", 
        estado_pago: "pendiente", 
        asesor: "Daniela",
        foto: "https://randomuser.me/api/portraits/women/44.jpg",
        saldo: 2500000
    },
    { 
        id: 3, 
        nombre: "Carlos y Sofía", 
        destino: "San Andrés", 
        fecha_viaje: "2026-02-10", 
        estado_pago: "mora", 
        asesor: "Valentina",
        foto: "https://randomuser.me/api/portraits/men/85.jpg",
        saldo: 1200000
    }
];

// ==========================================
// ELEMENTOS DOM
// ==========================================
const loginOverlay = document.getElementById('login-overlay');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const workspace = document.getElementById('workspace');

// ==========================================
// MAPAS (Init)
// ==========================================
window.initApp = function() { console.log("Google Maps Ready"); };

// ==========================================
// LÓGICA LOGIN
// ==========================================
if(loginForm){
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        let email = usernameInput.value.trim();
        if (!email.includes('@')) email += '@tranquillium.com';
        const password = passwordInput.value.trim();

        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                console.error(error);
                loginError.style.display = 'block';
            });
    };
}

if(logoutBtn) logoutBtn.onclick = () => auth.signOut().then(() => location.reload());

if(auth){
    auth.onAuthStateChanged((user) => {
        if (user) {
            loginOverlay.style.display = 'none';
            mainApp.style.display = 'flex';
            
            const userClean = user.email.split('@')[0];
            document.getElementById('user-name-display').textContent = userClean.toUpperCase();
            document.getElementById('user-initials').textContent = userClean.substring(0, 2).toUpperCase();
            
            // Cargar Dashboard por defecto
            loadView('home');
        } else {
            loginOverlay.style.display = 'flex';
            mainApp.style.display = 'none';
        }
    });
}

// ==========================================
// ENRUTADOR (ROUTER)
// ==========================================
window.loadView = function(viewName) {
    // 1. Activar menú visualmente
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    // (Opcional: lógica para resaltar botón actual)

    // 2. Limpiar Workspace
    workspace.innerHTML = ''; 

    switch(viewName) {
        case 'home':
            document.getElementById('current-view-title').textContent = "Resumen Operativo";
            renderDashboard();
            break;
        case 'crm':
            document.getElementById('current-view-title').textContent = "Gestión de Clientes (CRM)";
            renderCRM();
            break;
        case 'quotes':
            document.getElementById('current-view-title').textContent = "Generador de Cotizaciones";
            workspace.innerHTML = `<h3 style="padding:20px; text-align:center; color:#999;">Aquí cargará el Cotizador (Próximo paso)</h3>`;
            break;
        case 'confirms':
            document.getElementById('current-view-title').textContent = "Generador de Confirmación";
            workspace.innerHTML = `<h3 style="padding:20px; text-align:center; color:#999;">Aquí cargará el Confirmador (Próximo paso)</h3>`;
            break;
    }
};

// ==========================================
// VISTAS DEL SISTEMA
// ==========================================

// 1. DASHBOARD
function renderDashboard() {
    workspace.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <img src="https://i.imgur.com/GiTvvrW.png" width="180" style="margin-bottom:20px; filter: grayscale(100%); opacity:0.3;">
            <h2 style="color: var(--c-dark-blue);">Bienvenido a Viventura System</h2>
            <p class="text-muted">Selecciona una opción del menú para comenzar.</p>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-top:40px; max-width: 800px; margin-left:auto; margin-right:auto;">
                <div class="client-card" style="background:#fff7ed; border-left:5px solid #FE8050; text-align:center;">
                    <h4 style="color:#FE8050; margin:0;">Tareas Críticas</h4>
                    <p style="font-size:2.5rem; font-weight:bold; margin:10px 0; color:#1d1d1f;">3</p>
                    <small>Vencen hoy</small>
                </div>
                <div class="client-card" style="background:#ecfdf5; border-left:5px solid #22c55e; text-align:center;">
                    <h4 style="color:#166534; margin:0;">Viajes Próximos</h4>
                    <p style="font-size:2.5rem; font-weight:bold; margin:10px 0; color:#1d1d1f;">8</p>
                    <small>Esta semana</small>
                </div>
                <div class="client-card" style="background:#f0f9ff; border-left:5px solid #14A7CA; text-align:center;">
                    <h4 style="color:#0369a1; margin:0;">Meta del Mes</h4>
                    <p style="font-size:2.5rem; font-weight:bold; margin:10px 0; color:#1d1d1f;">75%</p>
                    <small>Vamos bien</small>
                </div>
            </div>
        </div>
    `;
}

// 2. CRM (CLIENTES)
function renderCRM() {
    // 1. Renderizar Barra de Búsqueda
    let html = `
        <div class="search-bar-container" style="background:white; padding:15px 20px; border-radius:12px; display:flex; gap:15px; margin-bottom:30px; box-shadow:0 4px 15px rgba(0,0,0,0.03); align-items:center;">
            <i class="fas fa-search" style="color:#94a3b8; font-size:18px;"></i>
            <input type="text" id="search-client" class="search-input" placeholder="Buscar por Nombre, Cédula, Destino o Fecha..." style="border:none; width:100%; outline:none; font-size:16px; background:transparent;">
            <div style="border-left:1px solid #eee; height:30px;"></div>
            <button class="btn-primary-v" onclick="openNewClientModal()">
                <i class="fas fa-plus"></i> Nuevo Cliente
            </button>
        </div>
        
        <div class="clients-grid">
    `;

    // 2. Renderizar Tarjetas de Clientes (Loop)
    DB_CLIENTES.forEach(cliente => {
        // Lógica del Semáforo
        let badgeClass = 'status-ok';
        let badgeText = 'PAZ Y SALVO';
        let borderColor = '#22c55e'; // Verde
        
        if(cliente.estado_pago === 'pendiente') { 
            badgeClass = 'status-alert'; 
            badgeText = `DEBE: $${cliente.saldo.toLocaleString()}`; 
            borderColor = '#FFC300'; // Amarillo
        }
        if(cliente.estado_pago === 'mora') { 
            badgeClass = 'status-danger'; 
            badgeText = '¡PAGO VENCIDO!'; 
            borderColor = '#ef4444'; // Rojo
        }

        html += `
            <div class="client-card" style="border-top: 5px solid ${borderColor};">
                <span class="status-badge ${badgeClass}" style="top:10px; right:10px;">${badgeText}</span>
                
                <div class="client-header" style="margin-top:10px;">
                    <!-- FOTO RITUAL -->
                    <div style="position:relative;">
                         <img src="${cliente.foto}" class="client-photo" style="width:70px; height:70px; border:3px solid white; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                         <div style="position:absolute; bottom:0; right:0; background:#14A7CA; color:white; width:20px; height:20px; border-radius:50%; font-size:10px; display:flex; align-items:center; justify-content:center; border:2px solid white;" title="Asesor: ${cliente.asesor}">
                            ${cliente.asesor.substring(0,1)}
                         </div>
                    </div>
                    
                    <div class="client-info">
                        <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:2px;">${cliente.nombre}</h4>
                        <span style="display:flex; align-items:center; gap:5px; font-size:13px;">
                            <i class="fas fa-map-marker-alt" style="color:#FE8050;"></i> ${cliente.destino}
                        </span>
                    </div>
                </div>

                <div class="client-stats" style="background:#f8fafc; padding:12px; border-radius:8px; display:flex; justify-content:space-between; margin-bottom:15px;">
                    <div>
                        <small style="color:#64748b;">Fecha Viaje</small>
                        <strong style="display:block; color:#1e293b;">${cliente.fecha_viaje}</strong>
                    </div>
                    <div style="text-align:right;">
                        <small style="color:#64748b;">Expediente</small>
                        <strong style="display:block; color:#1e293b;">#00${cliente.id}</strong>
                    </div>
                </div>

                <div class="client-actions">
                    <button class="btn-icon" title="Ver Perfil"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" title="Documentos"><i class="fas fa-folder-open"></i></button>
                    <button class="btn-icon" title="WhatsApp" style="color:#25D366; border-color:#25D366; background:#f0fdf4;"><i class="fab fa-whatsapp"></i> Contactar</button>
                </div>
            </div>
        `;
    });

    html += `</div>`; // Cerrar grid

    workspace.innerHTML = html;
}

// --- FUNCIÓN EXTRA: SIMULAR MODAL NUEVO CLIENTE ---
window.openNewClientModal = function() {
    alert("Aquí se abrirá el formulario para crear un cliente nuevo, subir la 'Foto Ritual' y asignar el asesor.");
}
