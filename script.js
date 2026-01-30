/* ==========================================
   TRANQUILLUM CORE - VIVANTURA SYSTEM V2.0
   ========================================== */

// 1. CONFIGURACIÓN FIREBASE (PROYECTO: tranquillium-32bb8)
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
        console.log("Firebase conectado.");
    }
} else {
    console.error("ERROR: Librerías de Firebase no cargadas.");
}

const auth = firebase.auth();
const storage = firebase.storage(); // Ahora sí funcionará

// 2. ELEMENTOS DEL DOM
const loginOverlay = document.getElementById('login-overlay');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const workspace = document.getElementById('workspace');

// 3. MAPAS (SOLUCIÓN ERROR CONSOLA)
// Definimos esta función en el objeto window para que la API de Google la encuentre
window.initApp = function() {
    console.log("API de Google Maps cargada correctamente.");
};

// 4. LÓGICA DE LOGIN
loginForm.onsubmit = (e) => {
    e.preventDefault();
    let email = usernameInput.value.trim();
    if (!email.includes('@')) email += '@tranquillium.com';
    const password = passwordInput.value.trim();

    auth.signInWithEmailAndPassword(email, password)
        .then((cred) => {
            console.log("Login exitoso:", cred.user.email);
            // El observador onAuthStateChanged hará el resto
        })
        .catch((error) => {
            console.error(error);
            loginError.style.display = 'block';
        });
};

logoutBtn.onclick = () => {
    auth.signOut().then(() => location.reload());
};

// 5. OBSERVADOR DE ESTADO (PERSISTENCIA)
auth.onAuthStateChanged((user) => {
    if (user) {
        loginOverlay.style.display = 'none';
        mainApp.style.display = 'flex';
        
        const userClean = user.email.split('@')[0];
        document.getElementById('user-name-display').textContent = userClean.toUpperCase();
        document.getElementById('user-initials').textContent = userClean.substring(0, 2).toUpperCase();
        
        loadView('home');
    } else {
        loginOverlay.style.display = 'flex';
        mainApp.style.display = 'none';
    }
});

// 6. ENRUTADOR DE VISTAS
window.loadView = function(viewName) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    workspace.innerHTML = ''; 

    if (viewName === 'home') {
        document.getElementById('current-view-title').textContent = "Resumen Operativo";
        renderDashboard();
    } else if (viewName === 'crm') {
        document.getElementById('current-view-title').textContent = "Gestión de Clientes";
        workspace.innerHTML = `<h3 style="padding:20px;">Módulo CRM (Próximamente)</h3>`;
    } else if (viewName === 'quotes') {
        document.getElementById('current-view-title').textContent = "Generador de Cotizaciones";
        // Aquí iría el HTML del cotizador
        workspace.innerHTML = `<h3 style="padding:20px;">Módulo Cotizador Cargando...</h3>`;
    } else if (viewName === 'confirms') {
        document.getElementById('current-view-title').textContent = "Generador de Confirmación";
        // Aquí iría el HTML del confirmador
        workspace.innerHTML = `<h3 style="padding:20px;">Módulo Confirmador Cargando...</h3>`;
    }
};

function renderDashboard() {
    workspace.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <img src="https://i.imgur.com/GiTvvrW.png" width="200" style="margin-bottom:20px; filter: grayscale(100%); opacity:0.5;">
            <h3>Bienvenido a Viventura System</h3>
            <p class="text-muted">Conectado y listo.</p>
        </div>
    `;
}
