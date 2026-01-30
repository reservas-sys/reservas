/* ==========================================
   TRANQUILLUM SYSTEM V5.0 (INTEGRADO)
   ========================================== */

// 1. CONFIGURACIÓN
const ACCESS_PASSWORD = 'HOLA'; // Para login simple
// Firebase Config (Poner la real de Tranquillium cuando esté lista)
const firebaseConfig = {
    apiKey: "AIzaSyD6II6k1Y4_bpzeH45hj_7-nQpxYmbP0wE",
    authDomain: "tranquillium-32bb8.firebaseapp.com",
    projectId: "tranquillium-32bb8",
    storageBucket: "tranquillium-32bb8.firebasestorage.app",
    messagingSenderId: "478019073507",
    appId: "1:478019073507:web:740e0b826d7881729c1cd6"
};

// Inicializar
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;

// Datos Asesores
const ADVISORS = {
    'katherine': { name: 'Katherine Rueda', whatsapp: '573249450254', photo: 'https://i.imgur.com/21GKFPV.png' },
    'daniela': { name: 'Daniela Ardila', whatsapp: '573213349780', photo: 'https://i.imgur.com/08PClCm.jpeg' },
    'admin': { name: 'Gerencia', whatsapp: '573000000000', photo: 'https://i.imgur.com/GiTvvrW.png' }
};

// 2. LOGICA LOGIN
const loginForm = document.getElementById('login-form');
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('password-input').value;
        const user = document.getElementById('username-input').value.toLowerCase();
        
        if(pass === ACCESS_PASSWORD) { // Login Simple
            document.getElementById('login-overlay').style.display = 'none';
            document.getElementById('main-app').style.display = 'flex';
            document.getElementById('user-name-display').textContent = user.toUpperCase();
            loadView('home');
        } else if(auth) { // Login Firebase (Si está activo)
            let email = user.includes('@') ? user : `${user}@tranquillum.com`;
            auth.signInWithEmailAndPassword(email, pass).catch(() => {
                 document.getElementById('login-error').style.display = 'block';
            });
        } else {
             document.getElementById('login-error').style.display = 'block';
        }
    });
}

if(auth) {
    auth.onAuthStateChanged(user => {
        if(user) {
            document.getElementById('login-overlay').style.display = 'none';
            document.getElementById('main-app').style.display = 'flex';
            loadView('home');
        }
    });
}

// 3. ENRUTADOR
window.loadView = function(viewName) {
    const workspace = document.getElementById('workspace');
    const title = document.getElementById('current-view-title');
    workspace.innerHTML = '';
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    if(viewName === 'home') {
        title.textContent = "Dashboard";
        renderDashboard(workspace);
    } else if (viewName === 'crm') {
        title.textContent = "Gestión de Clientes";
        renderCRM(workspace);
    } else if (viewName === 'quotes') {
        title.textContent = "Generador de Cotizaciones";
        renderCotizador(workspace);
    } else if (viewName === 'confirms') {
        title.textContent = "Generador de Confirmación";
        workspace.innerHTML = '<div style="padding:40px; text-align:center;"><h3>Confirmador en construcción...</h3></div>';
    }
};

// VISTA DASHBOARD
function renderDashboard(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <img src="https://i.imgur.com/GiTvvrW.png" width="150" style="filter: grayscale(1); opacity:0.3;">
            <h2 style="color:var(--text-dark); margin-top:20px;">Bienvenido a Tranquillum</h2>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-top:40px;">
                <div class="client-card" style="border-left:5px solid #FE8050;"><h4>🔥 Tareas</h4><h1>3</h1></div>
                <div class="client-card" style="border-left:5px solid #22c55e;"><h4>✈️ Viajes</h4><h1>8</h1></div>
                <div class="client-card" style="border-left:5px solid #14A7CA;"><h4>💰 Ventas</h4><h1>$45M</h1></div>
            </div>
        </div>
    `;
}

// VISTA CRM
function renderCRM(container) {
    const fakeClients = [
        { name: 'Juan Pérez', dest: 'Punta Cana', status: 'ok' },
        { name: 'Maria Gomez', dest: 'Cancún', status: 'alert' }
    ];
    let html = `<div class="clients-grid">`;
    fakeClients.forEach(c => {
        let color = c.status === 'ok' ? '#22c55e' : '#FFC300';
        html += `
            <div class="client-card" style="border-top: 5px solid ${color}">
                <div class="client-header">
                    <div class="client-photo" style="background:#eee;"></div>
                    <div><h4>${c.name}</h4><small>${c.dest}</small></div>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
}

// VISTA COTIZADOR (LÓGICA INYECTADA)
function renderCotizador(container) {
    // 1. Clonar Template
    const tpl = document.getElementById('tpl-cotizador');
    container.appendChild(tpl.content.cloneNode(true));
    
    // 2. Inicializar Selects
    const asesorSelect = container.querySelector('#asesor');
    const whatsappInput = container.querySelector('#whatsapp-asesor');
    const adultos = container.querySelector('#adultos');
    const ninos = container.querySelector('#ninos');

    Object.keys(ADVISORS).forEach(key => {
        asesorSelect.add(new Option(ADVISORS[key].name, key));
    });

    asesorSelect.addEventListener('change', () => {
        if(ADVISORS[asesorSelect.value]) whatsappInput.value = ADVISORS[asesorSelect.value].whatsapp;
    });

    for(let i=1; i<=20; i++) adultos.add(new Option(i, i));
    for(let i=0; i<=10; i++) ninos.add(new Option(i, i));
    
    // Numero Cotización
    const now = new Date();
    container.querySelector('#cotizacion-num').value = `COT-${now.getTime().toString().slice(-6)}`;

    // 3. Manejo del Formulario
    const form = container.querySelector('#quote-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Generando Cotización... (Aquí se integrará la lógica del PDF)");
    });
}

// FUNCIONES GLOBALES PARA EL HTML INYECTADO
window.addSection = function(type) {
    const container = document.getElementById('dynamic-sections');
    const tpl = document.getElementById(`tpl-${type}`);
    if(container && tpl) {
        const clone = tpl.content.cloneNode(true);
        // Activar pegado de imágenes en la nueva sección
        clone.querySelectorAll('.paste-area').forEach(area => {
            area.addEventListener('paste', handlePasteImage);
            area.addEventListener('click', () => navigator.clipboard.read().then(() => alert("Usa Ctrl+V para pegar")));
        });
        container.appendChild(clone);
    }
};

function handlePasteImage(e) {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
    if (item) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        const img = e.currentTarget.querySelector('img');
        const txt = e.currentTarget.querySelector('p');
        reader.onload = (ev) => {
            img.src = ev.target.result;
            img.style.display = 'block';
            if(txt) txt.style.display = 'none';
        };
        reader.readAsDataURL(blob);
    }
}

window.initApp = function() { console.log("Maps Ready"); };
