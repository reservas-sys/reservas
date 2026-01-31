/* ==========================================
   TRANQUILLUM SYSTEM V6.0 (INTEGRADO & REFACTORIZADO)
   ========================================== */

// ==========================================
// 1. CONFIGURACIÓN & SERVICIOS
// ==========================================

// EmailJS Config (Vivantura/Tranquillum)
const EMAILJS = {
    SERVICE_ID: 'service_1q1q1l9',
    TEMPLATE_ID: 'template_i7zwj8u',
    PUBLIC_KEY: 'Bwz_ooLl9-P5SjDQA'
};

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyD6II6k1Y4_bpzeH45hj_7-nQpxYmbP0wE",
    authDomain: "tranquillium-32bb8.firebaseapp.com",
    projectId: "tranquillium-32bb8",
    storageBucket: "tranquillium-32bb8.firebasestorage.app",
    messagingSenderId: "478019073507",
    appId: "1:478019073507:web:740e0b826d7881729c1cd6"
};

// Inicialización de Servicios
let auth, storage;

try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        storage = firebase.storage();
        console.log("Firebase Inicializado Correctamente");
    }
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS.PUBLIC_KEY);
        console.log("EmailJS Inicializado");
    }
} catch (e) {
    console.error("Error inicializando servicios:", e);
}

// Datos Estáticos (Asesores)
const ADVISORS = {
    'katherine': { name: 'Katherine Rueda', whatsapp: '573249450254', photo: 'https://i.imgur.com/21GKFPV.png' },
    'daniela': { name: 'Daniela Ardila', whatsapp: '573213349780', photo: 'https://i.imgur.com/08PClCm.jpeg' },
    'admin': { name: 'Gerencia', whatsapp: '573000000000', photo: 'https://i.imgur.com/GiTvvrW.png' },
    'María_Camila': { name: 'María Camila Ramirez Rodas', whatsapp: '573113173286', photo: 'https://i.imgur.com/SdubRgH.jpeg' },
    'Sarah_George': { name: 'Sarah George Esteves', whatsapp: '573332313485', photo: 'https://i.imgur.com/MCSsvz9.jpeg' },
    'Ana_Isabel': { name: 'Ana Isabel Buitrago García', whatsapp: '573217598780', photo: 'https://i.imgur.com/b7LIglY.jpeg' },
    'Nicol_Dayanna': { name: 'Nicol Dayanna Tamayo Buitrago', whatsapp: '573003895626', photo: 'https://i.imgur.com/7diSD8P.jpeg' },
    'Alejandra_Arroyo': { name: 'Alejandra Arroyo García', whatsapp: '573137449530', photo: 'https://i.imgur.com/aeMOvMs.jpeg' }
};

const ICONS = {
    destination: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
    calendar: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
    moon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>',
    bed: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7h2a2 2 0 012 2v9a2 2 0 01-2 2h-2m-6 0H7a2 2 0 01-2-2V9a2 2 0 012-2h2m4-4h2a2 2 0 012 2v2H9V5a2 2 0 012-2zM9 12h6"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    plane: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>'
};

const TERMS_AND_CONDITIONS = {
    flights: `<h3>✈️ Tiquetes Aéreos</h3><ul><li>Los valores e itinerarios cotizados están sujetos a cambios y disponibilidad por parte de las aerolíneas sin previo aviso.</li><li>Los vuelos incluidos en esta cotización son aproximados al momento de su emisión.</li><li>Para garantizar el valor y el itinerario proporcionado, se debe realizar el <strong>pago total inmediato</strong>.</li><li>Ninguna aerolínea permite separar, reservar o congelar precios sin el pago completo.</li><li>En caso de cambio de fecha, nombre del pasajero o cualquier modificación, la aerolínea aplicará penalidades según su política interna.</li><li>Niños mayores de 2 años cumplidos pagan tarifa de adulto.</li><li>Los tiquetes se emiten en tarifa básica, la cual incluye únicamente un <strong>artículo personal</strong> (mochila o bolso pequeño). Si deseas adicionar equipaje de mano o de bodega, se podrá incluir posteriormente o solicitar con anticipación. Ten en cuenta que esto genera un costo adicional.</li></ul>`,
    hotels: `<h3>🏨 Hoteles</h3><ul><li>La reserva hotelera se realiza inicialmente con un pago parcial (separación). El saldo restante deberá estar completamente pagado al menos <strong>45 días antes</strong> de la fecha del viaje.</li><li>Si deseas modificar la fecha del viaje, se validará primero la disponibilidad en el hotel. En caso de no estar disponible, se intentará mantener el valor en otro hotel de la misma categoría.</li><li>Si la nueva fecha corresponde a temporada alta y el valor se incrementa, el cliente deberá asumir la diferencia.</li><li>Niños mayores de 6 años pagan estadía en la mayoría de hoteles, de acuerdo con sus políticas.</li><li>En caso de que la garantía de 12 meses no sea suficiente y desees extenderla hasta 18 meses, esta extensión está sujeta a aprobación y puede implicar penalidades o ajustes de tarifa.</li><li>Se permite el cambio de titular de la reserva, siempre y cuando el titular actual lo autorice por escrito y el nuevo titular acepte los términos y condiciones vigentes.</li><li>Si decides cambiar de un destino internacional a uno nacional y el valor de la separación inicial supera $1.500.000 COP, este valor será dividido para aplicar a dos destinos nacionales.</li></ul>`,
    transfers: `<h3>🚐 Traslados</h3><ul><li>Si el plan incluye traslados desde el aeropuerto de Punta Cana al hotel en Punta Cana y posteriormente decides comprar vuelos con llegada a Santo Domingo, los traslados adicionales correrán por cuenta del cliente. Esto debido a la diferencia de distancia entre ambas ciudades y el reajuste necesario en la logística.</li></ul>`
};

const REGIMEN_TEMPLATES = {
    'todo_incluido': `Todo incluido: Desayunos, almuerzos, cenas, snacks y bebidas ilimitadas.`,
    'pension_completa': `Pensión Completa: Desayuno, almuerzo y cena.`,
    'media_pension': `Media Pensión: Desayuno y cena.`,
    'desayuno': `Alojamiento y Desayuno.`,
    'solo_hotel': `Solo alojamiento.`
};

// ==========================================
// 2. AUTENTICACIÓN
// ==========================================

// Listener de Estado de Auth
if (auth) {
    auth.onAuthStateChanged(user => {
        const loginOverlay = document.getElementById('login-overlay');
        const mainApp = document.getElementById('main-app');

        if (user) {
            loginOverlay.style.display = 'none';
            mainApp.style.display = 'flex';

            const displayName = user.displayName || user.email.split('@')[0];
            document.getElementById('user-name-display').textContent = displayName.toUpperCase();

            // Cargar vista inicial si no hay una cargada
            if (!document.getElementById('workspace').hasChildNodes()) loadView('home');
        } else {
            loginOverlay.style.display = 'flex';
            mainApp.style.display = 'none';
        }
    });
}

// Manejo del Formulario de Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('password-input').value;
        const user = document.getElementById('username-input').value.toLowerCase();
        const errorMsg = document.getElementById('login-error');

        if (auth) {
            let email = user.includes('@') ? user : `${user}@tranquillium.com`; // Corregido dominio
            if (user.includes('agent1')) email = `${user}@tranquillium.com`; // Parche específico si es necesario

            console.log("Login attempt:", email);

            auth.signInWithEmailAndPassword(email, pass).catch((error) => {
                console.error("Auth Error:", error);
                if (error.code === 'auth/too-many-requests') {
                    errorMsg.textContent = "Demasiados intentos. Espera unos minutos.";
                } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-login-credentials') {
                    errorMsg.textContent = "Credenciales incorrectas.";
                } else if (error.code === 'auth/user-not-found') {
                    errorMsg.textContent = "Usuario no registrado.";
                } else {
                    errorMsg.textContent = "Error: " + error.message;
                }
                errorMsg.style.display = 'block';
            });
        } else {
            errorMsg.textContent = "Firebase no disponible.";
            errorMsg.style.display = 'block';
        }
    });
}

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn && auth) {
    logoutBtn.addEventListener('click', () => {
        auth.signOut();
        document.getElementById('password-input').value = '';
    });
}

// ==========================================
// 3. ENRUTADOR & VISTAS
// ==========================================

window.loadView = function (viewName) {
    const workspace = document.getElementById('workspace');
    const title = document.getElementById('current-view-title');
    workspace.innerHTML = '';

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    // Marcar boton activo si existe un ID o lógica de selección (simplificado)

    switch (viewName) {
        case 'home':
            title.textContent = "Dashboard";
            renderDashboard(workspace);
            break;
        case 'crm':
            title.textContent = "Gestión de Clientes";
            renderCRM(workspace);
            break;
        case 'quotes':
            title.textContent = "Generador de Cotizaciones";
            renderCotizador(workspace);
            break;
        case 'confirms':
            title.textContent = "Pre Reserva";
            renderConfirmador(workspace); // Nueva función integrada
            break;
    }
};

// Toggle Sidebar Logic
const toggleBtn = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

// --- VISTA DASHBOARD ---
function renderDashboard(container) {
    // Usar placeholder si la imagen de imgur falla
    const logoSrc = "https://placehold.co/150x150/png?text=Tranquillum";
    container.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <img src="${logoSrc}" width="150" style="opacity:0.5;">
            <h2 style="color:var(--text-dark); margin-top:20px;">Bienvenido a Tranquillum System</h2>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-top:40px;">
                <div class="client-card" style="border-left:5px solid #FE8050;"><h4>🔥 Tareas</h4><h1>3</h1></div>
                <div class="client-card" style="border-left:5px solid #22c55e;"><h4>✈️ Viajes</h4><h1>8</h1></div>
                <div class="client-card" style="border-left:5px solid #14A7CA;"><h4>💰 Ventas</h4><h1>$45M</h1></div>
            </div>
        </div>
    `;
}

// --- VISTA CRM ---
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

// --- VISTA COTIZADOR ---
// --- VISTA COTIZADOR PRO (INTEGRADO) ---
function renderCotizador(container) {
    const tpl = document.getElementById('tpl-cotizador');
    if (!tpl) return;
    container.appendChild(tpl.content.cloneNode(true));

    // Variables de Estado (Locales a la vista)
    let pastedImages = {};
    let hotelCounter = 0;

    // Referencias DOM
    const form = container.querySelector('#quote-form-pro');
    const formSection = container.querySelector('#cotizador-form-section');
    const previewSection = container.querySelector('#quote-preview-section');
    
    // Contenedores Dinámicos
    const dynamicComponentsContainer = container.querySelector('#dynamic-components-container');
    const confirmationComponentsContainer = container.querySelector('#confirmation-components-container');
    
    // Inputs Principales
    const advisorSelect = container.querySelector('#asesor');
    const advisorWhatsappInput = container.querySelector('#whatsapp-asesor');
    const adultsSelect = container.querySelector('#adultos');
    const ninosSelect = container.querySelector('#ninos');
    const processQuoteBtn = container.querySelector('#process-quote-btn');
    const newQuoteBtn = container.querySelector('#new-quote-btn');
    const editQuoteBtn = container.querySelector('#edit-quote-btn');

    // Configuración de Campos Requeridos
    const requiredFieldsConfig = {
        'flights': ['ciudad-salida', 'flight-1-airline', 'flight-1-price'],
        'tours': ['tour-1-name', 'tour-1-price'],
        'transfers': ['transfer-1-desc', 'transfer-1-price']
    };

    // --- FUNCIONES AUXILIARES ---

    function populateMainDropdowns() {
        // Asesores
        advisorSelect.innerHTML = '<option value="" disabled selected>Selecciona tu nombre</option>';
        Object.keys(ADVISORS).forEach(key => {
            advisorSelect.add(new Option(ADVISORS[key].name, key));
        });

        // Adultos (1-20)
        for (let i = 1; i <= 20; i++) {
            const option = new Option(i, i);
            if (i === 2) option.selected = true;
            adultsSelect.add(option);
        }
        // Niños (0-10)
        for (let i = 0; i <= 10; i++) {
            const text = i === 0 ? '0' : (i === 1 ? '1 niño' : `${i} niños`);
            ninosSelect.add(new Option(text, i));
        }

        // Número de Cotización
        const now = new Date();
        container.querySelector('#cotizacion-numero').value = `COT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    }

    function handlePaste(e) {
        e.preventDefault();
        const pasteArea = e.currentTarget; 
        const imageId = pasteArea.dataset.imgId;
        const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
        if (item) {
            const reader = new FileReader();
            reader.onload = event => {
                const base64Image = event.target.result;
                const previewImg = pasteArea.querySelector('img');
                const pText = pasteArea.querySelector('p');
                if(previewImg) {
                    previewImg.src = base64Image;
                    previewImg.style.display = 'block';
                }
                if(pText) pText.style.display = 'none';
                pastedImages[imageId] = base64Image;
            };
            reader.readAsDataURL(item.getAsFile());
        }
    }

    function addEventListenersToSection(sectionElement) {
        if(!sectionElement) return;
        sectionElement.querySelectorAll('.paste-area').forEach(area => area.addEventListener('paste', handlePaste));
    }

    function updateRequiredFields(key, isRequired) {
        (requiredFieldsConfig[key] || []).forEach(id => {
            const el = container.querySelector('#' + id);
            if (el) el.required = isRequired;
        });
    }

    // --- GESTIÓN DE SECCIONES ---

    window.addSection = function(sectionKey) {
        // Nota: Definirla en window para onclicks del HTML, pero usando el scope local
        if (sectionKey === 'hotel') {
            hotelCounter++;
            const template = document.getElementById('tpl-hotel');
            if (!template) return;

            // Reemplazo manual de PLACEHOLDER porque cloneNode no reemplaza texto dentro
            let cloneHtml = template.innerHTML.replace(/PLACEHOLDER/g, hotelCounter);
            // Fix eventuales problemas de IDs duplicados si no se limpian bien
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cloneHtml;
            const cloneNode = tempDiv.firstElementChild;

            dynamicComponentsContainer.appendChild(cloneNode);

            // Poblar selects del nuevo hotel
            const nightsSelect = container.querySelector(`#cantidad-noches-${hotelCounter}`);
            for (let i = 1; i <= 30; i++) {
                const option = new Option(`${i} noche${i > 1 ? 's' : ''}`, i);
                if (i === 4) option.selected = true;
                if(nightsSelect) nightsSelect.add(option);
            }
            const roomsSelect = container.querySelector(`#cantidad-habitaciones-${hotelCounter}`);
            for (let i = 1; i <= 10; i++) {
                const option = new Option(`${i} habitación${i > 1 ? 'es' : ''}`, i);
                if (i === 1) option.selected = true;
                if(roomsSelect) roomsSelect.add(option);
            }
            
            addEventListenersToSection(cloneNode);
            
            // Lógica de botones +/-
            const mainAddBtn = container.querySelector(`.add-section-btn[data-section="hotel"]`);
            if(mainAddBtn && hotelCounter === 1) mainAddBtn.style.display = 'none';
            
            if (hotelCounter > 1) {
                const prevWrapper = container.querySelector(`#hotel-form-wrapper-${hotelCounter - 1}`);
                if(prevWrapper) {
                    const prevAddBtn = prevWrapper.querySelector('.add-subsection-btn');
                    if(prevAddBtn) prevAddBtn.style.display = 'none';
                }
            }
        } else {
            const template = document.getElementById(`tpl-${sectionKey}`);
            if (!template) return;
            // Clonar desde content template
            const clone = template.content.cloneNode(true);
            dynamicComponentsContainer.appendChild(clone);
            
            // Buscar el elemento wrapper recién insertado
            const wrapperId = `#${sectionKey}-form-wrapper`; 
            const newWrapper = dynamicComponentsContainer.querySelector(wrapperId);

            addEventListenersToSection(newWrapper);
            
            const mainAddBtn = container.querySelector(`.add-section-btn[data-section="${sectionKey}"]`);
            if(mainAddBtn) mainAddBtn.style.display = 'none';
            
            updateRequiredFields(sectionKey, true);
        }
    };

    // Event Delegation para botones dentro de secciones dinámicas
    container.addEventListener('click', e => {
        const target = e.target;
        
        // 1. Agregar Sección (delegado de los botones estáticos y dinámicos)
        if (target.matches('.add-section-btn')) {
            addSection(target.dataset.section);
        }
        
        // 2. Agregar Subsección (Otro Hotel, 2da opción vuelo)
        if (target.matches('.add-subsection-btn')) {
            const section = target.dataset.section; // hotel
            const subsection = target.dataset.subsection; // flight-2
            
            if (section === 'hotel') {
                addSection('hotel');
            } else if (subsection) {
                const wrapper = container.querySelector(`#${subsection}-form-wrapper`);
                if (wrapper) {
                    wrapper.style.display = 'block';
                    target.style.display = 'none';
                    // Update required logic if needed
                }
            }
        }

        // 3. Eliminar Sección/Subsección
        if (target.matches('.remove-section-btn')) {
            const section = target.dataset.section; // hotel-1, flights, tours
            const subsection = target.dataset.subsection; // flight-2

            if (subsection) {
                // Ocultar subsección (ej. vuelo 2)
                const wrapper = container.querySelector(`#${subsection}-form-wrapper`);
                if (wrapper) {
                    wrapper.style.display = 'none';
                    wrapper.querySelectorAll('input').forEach(input => input.value = '');
                    const addBtn = container.querySelector(`.add-subsection-btn[data-subsection="${subsection}"]`);
                    if(addBtn) addBtn.style.display = 'block';
                }
            } else if (section && section.startsWith('hotel-')) {
                // Eliminar Hotel Específico
                const hotelNum = section.split('-')[1];
                 const wrapper = container.querySelector(`#hotel-form-wrapper-${hotelNum}`);
                if (wrapper) {
                    wrapper.remove();
                    // Lógica para reaparecer botones si borras el último
                    const hotels = container.querySelectorAll('.hotel-form-wrapper');
                    if (hotels.length === 0) {
                        hotelCounter = 0;
                        const mainBtn = container.querySelector(`.add-section-btn[data-section="hotel"]`);
                        if(mainBtn) mainBtn.style.display = 'block';
                    } else {
                        // Mostrar botón añadir en el último hotel
                         const lastHotel = hotels[hotels.length - 1];
                         const lastBtn = lastHotel.querySelector('.add-subsection-btn');
                         if(lastBtn) lastBtn.style.display = 'block';
                    }
                }
            } else if (section) {
                // Eliminar sección única (vuelos, tours, transfers)
                const wrapper = container.querySelector(`#${section}-form-wrapper`);
                if (wrapper) {
                    wrapper.remove();
                    const mainBtn = container.querySelector(`.add-section-btn[data-section="${section}"]`);
                    if(mainBtn) mainBtn.style.display = 'block';
                    updateRequiredFields(section, false);
                }
            }
        }
    });

    // --- POPULATE QUOTE (GENERAR VISTA PREVIA) ---
    function populateQuote() {
        const advisorKey = advisorSelect.value;
        const advisor = ADVISORS[advisorKey];
        const clientName = container.querySelector('#nombre-cliente').value;
        const quoteNumber = container.querySelector('#cotizacion-numero').value;
        const adults = adultsSelect.value;
        const children = ninosSelect.value;
        const validez = container.querySelector('#validez-cupos').value;

        // Header Texts
        const introText = `¡Hola, ${clientName.split(' ')[0].toUpperCase()}! He preparado estas opciones para tu próximo viaje.`;
        container.querySelector('#confirm-intro-text').textContent = introText;
        
        container.querySelector('#confirm-customer-data-box').innerHTML = 
            `<p>Para: <strong>${clientName.toUpperCase()}</strong></p>` +
            `<p>Pasajeros: <strong>${adults} Adulto${adults > 1 ? 's' : ''}${children > 0 ? ` y ${children} Niño${children > 1 ? 's' : ''}` : ''}</strong></p>` +
            `<p>Nº Cotización: <strong>${quoteNumber}</strong> | Validez: <strong>${validez}</strong></p>`;

        // Advisor Info
        if (advisor) {
            const advisorPhoto = container.querySelector('#advisor-photo');
            if(advisorPhoto) advisorPhoto.src = advisor.photo;
            container.querySelector('#advisor-name').textContent = advisor.name;
        }

        // Links
        const wLink = `https://wa.me/${advisorWhatsappInput.value}`;
        
        const setHref = (sel, msg) => {
            const el = container.querySelector(sel);
            if(el) el.href = `${wLink}?text=${encodeURIComponent(msg)}`;
        };

        setHref('#advisor-whatsapp-btn', `Hola ${advisor?.name || ''}, tengo una pregunta sobre la cotización *${quoteNumber}*.`);
        setHref('#cta-contactar', `Hola ${advisor?.name || ''}, tengo una pregunta sobre la cotización *${quoteNumber}*.`);
        setHref('#cta-reservar', `¡Hola ${advisor?.name || ''}! Estoy listo para reservar según la cotización *${quoteNumber}*.`);
        setHref('#footer-wpp-link', `Hola, quiero contactar a mi asesor.`);

        // Limpiar contenedor previo
        confirmationComponentsContainer.innerHTML = '';

        // 1. HOTELES
        const hotelForms = container.querySelectorAll('.hotel-form-wrapper');
        hotelForms.forEach((formWrapper, index) => {
            // Extraer ID numérico del wrapper (hotel-form-wrapper-1 => 1)
            const num = formWrapper.id.match(/\d+/)[0]; 

            // Helpers de extracción segura
            const getVal = (s) => { const el = formWrapper.querySelector(s); return el ? el.value : ''; };
            const getTxt = (s) => { const el = formWrapper.querySelector(s); return el ? el.options[el.selectedIndex].text : ''; };

            // Galería
            let galleryHTML = [1, 2, 3].map(i => {
                const key = `hotel-${num}-foto-${i}`;
                return pastedImages[key] ? `<img src="${pastedImages[key]}">` : '';
            }).join('');

            let hotelDetailsHTML = `
                <div class="data-item">${ICONS.destination}<div class="data-item-content"><strong>Destino:</strong><p>${getVal(`#destino-${num}`)}</p></div></div>
                <div class="data-item">${ICONS.calendar}<div class="data-item-content"><strong>Fechas:</strong><p>${formatDate(getVal(`#fecha-viaje-${num}`))}</p></div></div>
                <div class="data-item">${ICONS.moon}<div class="data-item-content"><strong>Noches:</strong><p>${getTxt(`#cantidad-noches-${num}`)}</p></div></div>
                <div class="data-item">${ICONS.bed}<div class="data-item-content"><strong>Habitaciones:</strong><p>${getTxt(`#cantidad-habitaciones-${num}`)}</p></div></div>`;
            
            const regimenVal = getVal(`#regimen-${num}`);
            const currencyVal = getVal(`#moneda-${num}`);
            
            confirmationComponentsContainer.innerHTML += `
                <div class="quote-option-box">
                    <div class="option-header"><h3>Hotel ${index + 1}</h3><span class="option-price">${formatCurrency(getVal(`#valor-total-${num}`), currencyVal)}</span></div>
                    <div class="option-body">
                        <h4>${getVal(`#hotel-${num}`)}</h4>
                        <div class="photo-gallery">${galleryHTML || '<p style="font-size:12px;color:#999;text-align:center;width:100%;">Sin fotos</p>'}</div>
                        <div class="details-grid">
                            ${hotelDetailsHTML}
                            <div class="data-item full-width">${ICONS.check}<div class="data-item-content"><strong>Plan Incluye:</strong><p>${REGIMEN_TEMPLATES[regimenVal] || 'No especificado'}</p></div></div>
                        </div>
                    </div>
                </div>`;
        });

        // 2. VUELOS
        const flightWrapper = container.querySelector('#flights-form-wrapper');
        if (flightWrapper) {
           const depCity = container.querySelector('#ciudad-salida').value;
           let optionsHTML = '';
           
           // Opción 1
           const air1 = container.querySelector('#flight-1-airline').value;
           const pr1 = container.querySelector('#flight-1-price').value;
           if(air1) optionsHTML += `<div class="item-option"><strong>Opción 1:</strong> ${air1} <span class="item-price">Desde ${formatCurrency(pr1)}</span></div>`;
           
           // Opción 2
           const fw2 = container.querySelector('#flight-2-form-wrapper');
           if(fw2 && fw2.style.display !== 'none') {
               const air2 = container.querySelector('#flight-2-airline').value;
               const pr2 = container.querySelector('#flight-2-price').value;
                if(air2) optionsHTML += `<div class="item-option"><strong>Opción 2:</strong> ${air2} <span class="item-price">Desde ${formatCurrency(pr2)}</span></div>`;
           }
           
           const bannerKey = 'flight-banner-preview';
           const bannerImg = pastedImages[bannerKey] ? `<div class="flight-banner"><img src="${pastedImages[bannerKey]}"></div>` : '';

           confirmationComponentsContainer.innerHTML += `
            <div class="component-section">
                <h3>Vuelos Sugeridos</h3>
                ${bannerImg}
                <div id="flight-options-confirm-container">
                    <div class="data-item">${ICONS.plane}<div class="data-item-content"><strong>Desde:</strong><p>${depCity}</p></div></div>
                    ${optionsHTML}
                </div>
                <p class="item-disclaimer">*Valores por persona, sujetos a cambio sin previo aviso.</p>
            </div>`;
        }

        // 3. TOURS & TRASLADOS
        ['tours', 'transfers'].forEach(type => {
            const wrapper = container.querySelector(`#${type}-form-wrapper`);
            if (wrapper) {
                const imgKey = `${type.slice(0, -1)}-main-photo`; // tour-main-photo
                const imgHTML = pastedImages[imgKey] ? `<div class="single-photo-container"><img src="${pastedImages[imgKey]}"></div>` : '';
                
                const nameId = type === 'tours' ? '#tour-1-name' : '#transfer-1-desc';
                const priceId = type === 'tours' ? '#tour-1-price' : '#transfer-1-price';
                
                const desc = container.querySelector(nameId).value;
                const price = container.querySelector(priceId).value;

                confirmationComponentsContainer.innerHTML += `
                <div class="component-section">
                    <h3>${type === 'tours' ? 'Tours Opcionales' : 'Traslados'}</h3>
                    <div class="option-body">
                        ${imgHTML}
                        <div class="item-option">${desc}<span class="item-price">Desde ${formatCurrency(price)}</span></div>
                    </div>
                </div>`;
            }
        });

        // 4. FINAL DETAILS
        const setConf = (id, val) => container.querySelector('#' + id).textContent = val;
        
        setConf('confirm-pago-reserva', formatCurrency(container.querySelector('#pago-reserva').value));
        setConf('confirm-pago-segundo', formatCurrency(container.querySelector('#pago-segundo').value));
        setConf('confirm-fecha-limite', container.querySelector('#fecha-limite-pago').value);
        setConf('confirm-no-incluye', container.querySelector('#no-incluye').value);

        // 5. TERMS
        let termsHTML = '';
        if (hotelForms.length > 0) termsHTML += TERMS_AND_CONDITIONS.hotels;
        if (flightWrapper) termsHTML += TERMS_AND_CONDITIONS.flights;
        if (container.querySelector('#transfers-form-wrapper')) termsHTML += TERMS_AND_CONDITIONS.transfers;

        const termsDiv = container.querySelector('#terms-section-confirm');
        if (termsHTML) {
            container.querySelector('#confirm-terms-content').innerHTML = termsHTML;
            termsDiv.style.display = 'block';
        } else {
            termsDiv.style.display = 'none';
        }
    }

    // --- PROCESAR PDF ---
    async function handleProcessQuote() {
        toggleLoader(true, "Generando PDF...");
        processQuoteBtn.disabled = true;
        try {
            const elementToPrint = container.querySelector('#voucher-to-print');
            const canvas = await html2canvas(elementToPrint, { scale: 2, useCORS: true, logging: false });
            
            // A4 Portrait
            const pdf = new window.jspdf.jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
            
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, canvas.width, canvas.height);
            
            // Hyperlinks
            const scaleFactor = canvas.width / elementToPrint.offsetWidth;
            ['advisor-whatsapp-btn', 'cta-reservar', 'cta-contactar', 'footer-wpp-link'].forEach(id => {
                const el = container.querySelector('#' + id);
                if (el && el.href) {
                     const rect = el.getBoundingClientRect();
                     const parentRect = elementToPrint.getBoundingClientRect();
                     pdf.link(
                        (rect.left - parentRect.left) * scaleFactor, 
                        (rect.top - parentRect.top) * scaleFactor, 
                        rect.width * scaleFactor, 
                        rect.height * scaleFactor, 
                        { url: el.href }
                    );
                }
            });

            const qNum = container.querySelector('#cotizacion-numero').value;
            const cName = container.querySelector('#nombre-cliente').value;
            pdf.save(`Cotizacion_${qNum}_${cName.replace(/ /g, '_')}.pdf`);
            
        } catch (error) {
            console.error(error);
            alert("Error al generar PDF: " + error.message);
        } finally {
            toggleLoader(false);
            processQuoteBtn.disabled = false;
        }
    }

    // --- INICIALIZACIÓN ---
    populateMainDropdowns();

    // Listeners del Asesor
    advisorSelect.addEventListener('change', () => {
        const adv = ADVISORS[advisorSelect.value];
        if(adv) advisorWhatsappInput.value = adv.whatsapp;
    });

    // Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (dynamicComponentsContainer.children.length === 0) {
            alert('Debes añadir al menos un componente (Hotel, Vuelos, etc).');
            return;
        }

        populateQuote();
        
        formSection.style.display = 'none';
        previewSection.style.display = 'block';
        window.scrollTo(0, 0);
    });

    // Botones de Acción
    processQuoteBtn.addEventListener('click', handleProcessQuote);
    
    newQuoteBtn.addEventListener('click', () => {
        if(confirm("¿Estás seguro? Se borrarán todos los datos.")) {
            loadView('quotes'); // Recargar vista es más limpio
        }
    });

    editQuoteBtn.addEventListener('click', () => {
        previewSection.style.display = 'none';
        formSection.style.display = 'block';
        window.scrollTo(0, 0);
    });
}

// --- VISTA CONFIRMADOR (NUEVA INTEGRACIÓN) ---
function renderConfirmador(container) {
    const tpl = document.getElementById('tpl-confirmador');
    if (!tpl) {
        container.innerHTML = "<h3>Error: Template de Confirmador no encontrado.</h3>";
        return;
    }
    container.appendChild(tpl.content.cloneNode(true));

    // Referencias DOM dentro del contenedor
    const form = container.querySelector('#pre-reserva-form');
    const formSection = container.querySelector('#form-section');
    const confirmationSection = container.querySelector('#confirmation-section');
    const processBtn = container.querySelector('#process-voucher-btn');
    const newVoucherBtn = container.querySelector('#new-voucher-btn');

    // Configuración Inicial
    const fechaInput = container.querySelector('#fecha-viaje');
    if (fechaInput) fechaInput.min = new Date().toISOString().split("T")[0];

    container.querySelector('#valor-restante').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    // 1. Manejo del Formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        populateConfirmationVoucher(container);
        formSection.style.display = 'none';
        confirmationSection.style.display = 'block';
        window.scrollTo(0, 0);
    });

    // 2. Procesar PDF y Envío
    processBtn.addEventListener('click', async () => {
        await processAndSendVoucher(container, processBtn);
    });

    // 3. Nuevo Voucher
    newVoucherBtn.addEventListener('click', () => {
        confirmationSection.style.display = 'none';
        formSection.style.display = 'block';
        form.reset();
        window.scrollTo(0, 0);
    });

    // Inicializar Google Maps Autocomplete si está cargado
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        initAutocompleteForContainer(container);
    }
}

// ==========================================
// 4. LÓGICA DE NEGOCIO (CONFIRMADOR)
// ==========================================

function populateConfirmationVoucher(container) {
    // Recopilar Datos
    const getVal = (id) => container.querySelector('#' + id).value;
    const data = {
        destino: getVal('destino'),
        hotel: getVal('hotel'),
        nombre: getVal('nombre-completo'),
        documento: getVal('documento'),
        telefono: getVal('telefono'),
        email: getVal('email'),
        direccion: getVal('direccion'),
        checkin: getVal('fecha-viaje'),
        noches: parseInt(getVal('cantidad-noches')),
        habitaciones: parseInt(getVal('cantidad-habitaciones')),
        localizador: getVal('localizador') || 'Pendiente',
        regimen: getVal('regimen'),
        saldo: getVal('valor-restante'),
        moneda: getVal('moneda'),
        acompanantes: getVal('acompanantes'),
        observaciones: getVal('observaciones')
    };

    // Cálculos
    const checkInDate = new Date(data.checkin + 'T00:00:00');
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + data.noches);

    const fmtInfo = {
        checkin: formatDate(checkInDate),
        checkout: formatDate(checkOutDate),
        noches: `${data.noches} ${data.noches > 1 ? 'noches' : 'noche'}`,
        habitaciones: `${data.habitaciones} ${data.habitaciones > 1 ? 'habitaciones' : 'habitación'}`,
        saldo: formatCurrency(data.saldo, data.moneda),
        acompanantes: data.acompanantes.trim() || 'No especificado',
        observaciones: data.observaciones.trim() || 'Ninguna',
        direccion: data.direccion.trim() || 'No especificada'
    };

    let planDesc = '';
    switch (data.regimen) {
        case 'Solo hotel': planDesc = 'Alojamiento según las noches estipuladas.'; break;
        case 'Hotel y desayuno': planDesc = 'Alojamiento y Desayuno diario.'; break;
        case 'Media Pensión': planDesc = 'Alojamiento, Desayuno y una comida principal.'; break;
        case 'Pensión Completa': planDesc = 'Alojamiento, Desayuno, Almuerzo y Cena.'; break;
        case 'Todo incluido': planDesc = 'Alojamiento, todas las comidas, bebidas y snacks ilimitados.'; break;
    }

    // Inyectar en Vista
    const setTxt = (id, txt) => container.querySelector('#' + id).textContent = txt;

    setTxt('confirm-destino', data.destino);
    setTxt('confirm-hotel', data.hotel);
    setTxt('confirm-checkin', fmtInfo.checkin);
    setTxt('confirm-checkout', fmtInfo.checkout);
    setTxt('confirm-noches', fmtInfo.noches);
    setTxt('confirm-habitaciones', fmtInfo.habitaciones);
    setTxt('confirm-localizador', data.localizador);
    setTxt('confirm-regimen', data.regimen);
    setTxt('confirm-plan-incluye', planDesc);
    setTxt('confirm-nombre', data.nombre);
    setTxt('confirm-documento', data.documento);
    setTxt('confirm-telefono', data.telefono);
    setTxt('confirm-email', data.email);
    setTxt('confirm-direccion', fmtInfo.direccion);
    setTxt('confirm-acompanantes', fmtInfo.acompanantes);
    setTxt('confirm-observaciones', fmtInfo.observaciones);
    setTxt('confirm-valor-restante', fmtInfo.saldo);

    // Links WhatsApp
    const wppNum = '3137449530';
    const setLink = (id, msg) => container.querySelector('#' + id).href = `https://wa.me/${wppNum}?text=${encodeURIComponent(msg)}`;

    setLink('banner-vuelos', `Cotizar vuelos para ${data.destino}. Titular: ${data.nombre}`);
    setLink('banner-tours', `Información tours en ${data.destino}. Titular: ${data.nombre}`);
    setLink('banner-traslados', `Traslados en ${data.destino}. Titular: ${data.nombre}`);
}

async function processAndSendVoucher(container, btn) {
    if (!storage) { alert("Error: Almacenamiento no configurado."); return; }

    toggleGlobalLoader(true, "Generando PDF...");
    btn.disabled = true;

    try {
        const element = container.querySelector('#voucher-to-print');
        const nombreCliente = container.querySelector('#nombre-completo').value;
        const emailCliente = container.querySelector('#email').value;
        const nombreHotel = container.querySelector('#hotel').value;

        // Generar Canvas
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const { width, height } = canvas;

        // Crear PDF
        const pdf = new window.jspdf.jsPDF({ orientation: 'p', unit: 'px', format: [width, height] });
        pdf.addImage(imgData, 'JPEG', 0, 0, width, height);

        // Añadir Links Funcionales al PDF
        const scale = width / element.offsetWidth;
        const addPdfLink = (id) => {
            const el = container.querySelector('#' + id);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const parentRect = element.getBoundingClientRect();
            pdf.link((rect.left - parentRect.left) * scale, (rect.top - parentRect.top) * scale, rect.width * scale, rect.height * scale, { url: el.href });
        };
        ['banner-vuelos', 'banner-tours', 'banner-traslados'].forEach(addPdfLink);

        // Guardar Local
        pdf.save(`Confirmacion_${nombreCliente.replace(/\s+/g, '_')}.pdf`);

        // Subir y Enviar
        toggleGlobalLoader(true, "Subiendo y Enviando...");
        const pdfBlob = pdf.output('blob');
        const fileName = `confirmaciones/${Date.now()}_${nombreCliente.replace(/\s+/g, '_')}.pdf`;

        const ref = storage.ref(fileName);
        await ref.put(pdfBlob);
        const downloadURL = await ref.getDownloadURL();

        // Email
        if (typeof emailjs !== 'undefined') {
            await emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.TEMPLATE_ID, {
                nombre_cliente: nombreCliente,
                nombre_hotel: nombreHotel,
                to_email: emailCliente,
                download_link: downloadURL
            });
            alert("¡Proceso Completado!\nPDF descargado y correo enviado exitosamente.");
        } else {
            alert("PDF Descargado.\nNo se pudo enviar correo (EmailJS no cargado).");
        }

    } catch (e) {
        console.error("Error proceso voucher:", e);
        alert("Ocurrió un error: " + e.message);
    } finally {
        toggleGlobalLoader(false);
        btn.disabled = false;
    }
}

// ==========================================
// 5. UTILIDADES GLOBALES
// ==========================================

function toggleGlobalLoader(show, text = "Cargando...") {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
        const txt = loader.querySelector('p');
        if (txt) txt.textContent = text;
    }
}

function formatDate(date) {
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatCurrency(value, currency) {
    const number = parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
    if (isNaN(number)) return currency === 'COP' ? '$ 0' : '$ 0.00';
    return number.toLocaleString(currency === 'COP' ? 'es-CO' : 'en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'COP' ? 0 : 2
    });
}

// Funciones expuestas globalmente
window.addSection = function (type) {
    const container = document.getElementById('dynamic-sections');
    const tpl = document.getElementById(`tpl-${type}`);
    if (container && tpl) {
        const clone = tpl.content.cloneNode(true);
        clone.querySelectorAll('.paste-area').forEach(area => {
            area.addEventListener('paste', handlePasteImage);
            area.addEventListener('click', () => navigator.clipboard.read().then(() => alert("Usa Ctrl+V")));
        });
        container.appendChild(clone);
    }
};

function handlePasteImage(e) {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
    if (item) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = e.currentTarget.querySelector('img');
            const txt = e.currentTarget.querySelector('p');
            img.src = ev.target.result;
            img.style.display = 'block';
            if (txt) txt.style.display = 'none';
        };
        reader.readAsDataURL(item.getAsFile());
    }
}

function initAutocompleteForContainer(container) {
    const destinoInput = container.querySelector('#destino');
    const hotelInput = container.querySelector('#hotel');

    if (typeof google === 'undefined' || !google.maps || !google.maps.places) return;

    try {
        // 1. Autocomplete Destino
        const destinoAutocomplete = new google.maps.places.Autocomplete(destinoInput, { types: ['(cities)'], fields: ['geometry', 'name'] });

        // 2. Autocomplete Hotel
        const hotelAutocomplete = new google.maps.places.Autocomplete(hotelInput, { types: ['establishment'], fields: ['name', 'geometry'] });

        // 3. Listener Destino
        destinoAutocomplete.addListener('place_changed', () => {
            const place = destinoAutocomplete.getPlace();
            // Solo actualizar si hay un nombre válido devuelto por la API
            if (place && place.name && place.name !== 'undefined') {
                destinoInput.value = place.name;
            }
            // Actualizar bounds
            if (place && place.geometry && place.geometry.viewport) {
                hotelAutocomplete.setBounds(place.geometry.viewport);
            }
        });

        // 4. Listener Hotel
        hotelAutocomplete.addListener('place_changed', () => {
            const place = hotelAutocomplete.getPlace();
            if (place && place.name && place.name !== 'undefined') {
                hotelInput.value = place.name;
            }
        });

    } catch (e) {
        console.warn("Google Maps Autocomplete Error:", e);
    }
}

window.initApp = function () { console.log("Maps API Ready"); };
