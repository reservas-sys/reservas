// ==========================================
// CONFIGURACIÓN FIREBASE (TRANQUILLIUM)
// ==========================================
console.log("Iniciando Sistema Viventura...");

const firebaseConfig = {
    apiKey: "AIzaSyD6II6k1Y4_bpzeH45hj_7-nQpxYmbP0wE",
    authDomain: "tranquillium-32bb8.firebaseapp.com",
    projectId: "tranquillium-32bb8",
    storageBucket: "tranquillium-32bb8.firebasestorage.app",
    messagingSenderId: "478019073507",
    appId: "1:478019073507:web:740e0b826d7881729c1cd6"
};

// Inicializar Firebase
try {
    if (typeof firebase === 'undefined') {
        console.error("ERROR CRÍTICO: El SDK de Firebase no ha cargado en el HTML.");
    } else {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase conectado correctamente.");
        }
    }
} catch (e) {
    console.error("Error inicializando Firebase:", e);
}

const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const storage = typeof firebase !== 'undefined' ? firebase.storage() : null;

// ==========================================
// ELEMENTOS DEL DOM
// ==========================================
const loginOverlay = document.getElementById('login-overlay');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const workspace = document.getElementById('workspace'); // Donde se carga el contenido

// ==========================================
// LÓGICA DE AUTENTICACIÓN (LOGIN REAL)
// ==========================================

// 1. Manejar el Submit del Login
if (loginForm) {
    loginForm.onsubmit = function (e) {
        e.preventDefault();
        
        // Asumimos dominio por defecto si no lo escriben
        let email = usernameInput.value.trim();
        if (!email.includes('@')) {
            email = email + '@tranquillium.com';
        }
        
        const password = passwordInput.value.trim();

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login exitoso, el onAuthStateChanged se encargará del resto
                console.log("Usuario logueado:", userCredential.user.email);
            })
            .catch((error) => {
                console.error("Error login:", error);
                loginError.textContent = 'Usuario o contraseña incorrectos';
                loginError.style.display = 'block';
                passwordInput.value = '';
            });
    };
}

// 2. Manejar Logout
if (logoutBtn) {
    logoutBtn.onclick = function () {
        auth.signOut().then(() => {
            console.log("Sesión cerrada");
            window.location.reload();
        });
    };
}

// 3. Escuchador de Estado (Persistencia)
if (auth) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // --- USUARIO LOGUEADO ---
            console.log("Acceso concedido a:", user.email);
            
            // Ocultar login, mostrar app
            if (loginOverlay) loginOverlay.style.display = 'none';
            if (mainApp) mainApp.style.display = 'flex';

            // Configurar interfaz según usuario
            const username = user.email.split('@')[0];
            updateUserProfile(username);
            
            // Cargar Dashboard por defecto
            loadView('home');

        } else {
            // --- NO LOGUEADO ---
            if (loginOverlay) loginOverlay.style.display = 'flex';
            if (mainApp) mainApp.style.display = 'none';
        }
    });
}

// Actualizar datos visuales del perfil
function updateUserProfile(username) {
    const nameDisplay = document.getElementById('user-name-display');
    const roleDisplay = document.getElementById('user-role-display');
    const initialsDisplay = document.getElementById('user-initials');

    if (nameDisplay) nameDisplay.textContent = username.toUpperCase();
    if (initialsDisplay) initialsDisplay.textContent = username.substring(0, 2).toUpperCase();

    // Roles simples basados en el nombre de usuario
    let role = 'Asesor Comercial';
    if (username === 'admin' || username === 'gerencia') role = 'Administrador';
    if (username === 'reservas') role = 'Coord. Reservas';
    
    if (roleDisplay) roleDisplay.textContent = role;
}


// ==========================================
// NAVEGACIÓN Y VISTAS
// ==========================================
window.loadView = function(viewName) {
    // Actualizar menú activo
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    // Limpiar área
    workspace.innerHTML = '';

    if (viewName === 'home') {
        document.getElementById('current-view-title').textContent = "Resumen Operativo";
        renderDashboard();
    } 
    else if (viewName === 'crm') {
        document.getElementById('current-view-title').textContent = "Gestión de Clientes";
        renderCRM();
    }
    else if (viewName === 'quotes') {
        document.getElementById('current-view-title').textContent = "Generador de Cotizaciones";
        renderTool('cotizador');
    }
    else if (viewName === 'confirms') {
        document.getElementById('current-view-title').textContent = "Generador de Confirmación";
        renderTool('confirmador');
    }
};

function renderDashboard() {
    workspace.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <img src="https://i.imgur.com/GiTvvrW.png" width="200" style="margin-bottom:20px; filter: grayscale(100%); opacity:0.5;">
            <h3>Bienvenido a Viventura System</h3>
            <p class="text-muted">Sistema conectado a Firebase.</p>
        </div>
    `;
}

function renderCRM() {
    workspace.innerHTML = `<h3 style="padding:20px;">Módulo CRM en construcción...</h3>`;
}

function renderTool(toolType) {
    // Aquí cargaremos los templates que ya tienes en el HTML
    // Por ahora un placeholder para verificar que el login funciona
    workspace.innerHTML = `
        <div style="padding:40px; text-align:center;">
            <h3>Cargando ${toolType.toUpperCase()}...</h3>
            <div class="spinner"></div>
        </div>
    `;
}

// Inicialización de Mapas (Evita errores si no se usa)
function initAutocomplete() {
    console.log("Mapas listos");
}
