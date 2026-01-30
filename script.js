// FIREBASE CONFIG - Tranquillium
console.log("Script starting...");

const firebaseConfig = {
    apiKey: "AIzaSyD6II6k1Y4_bpzeH45hj_7-nQpxYmbP0wE",
    authDomain: "tranquillium-32bb8.firebaseapp.com",
    projectId: "tranquillium-32bb8",
    storageBucket: "tranquillium-32bb8.firebasestorage.app",
    messagingSenderId: "478019073507",
    appId: "1:478019073507:web:740e0b826d7881729c1cd6"
};

try {
    if (typeof firebase === 'undefined') {
        console.error("CRITICAL: Firebase SDK not loaded!");
    } else {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized.");
        } else {
            console.log("Firebase already initialized.");
        }
    }
} catch (e) {
    console.error("Firebase Init Error:", e);
}

const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;

// ELEMENTOS DOM
console.log("Querying DOM elements...");
const loginOverlay = document.getElementById('login-overlay');
if (!loginOverlay) console.error("FATAL: login-overlay not found in DOM");
const mainApp = document.getElementById('main-app');
if (!mainApp) console.error("FATAL: main-app not found in DOM");

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// LOGIN
loginForm.onsubmit = function (e) {
    e.preventDefault();
    const email = usernameInput.value.trim() + '@tranquillium.com';
    const password = passwordInput.value.trim();
    usernameInput.value = '';
    passwordInput.value = '';
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            usernameInput.value = usernameInput.dataset.lastValue || '';
            loginError.textContent = 'Usuario o contraseña incorrectos';
            loginError.classList.add('visible');
            passwordInput.focus();
        });
};

// LOGOUT
logoutBtn.onclick = function () {
    auth.signOut().then(() => {
        usernameInput.value = '';
        passwordInput.value = '';
        loginError.classList.remove('visible');
        usernameInput.focus();
    });
};

// PERSISTENCIA AUTH
auth.onAuthStateChanged((user) => {
    if (user) {
        // LOGUEADO
        loginOverlay.style.display = 'none';
        mainApp.style.display = 'block';
        document.querySelector('.header-app h2').innerHTML = `🛫 Tranquillium <strong style="color:#23C3E8">${user.email.split('@')[0]}</strong>`;
        const username = user.email.split('@')[0];
        let userRole = 'comercial'; // Default
        if (username === 'comercial') userRole = 'comercial';
        else if (username === 'reservas') userRole = 'reservas';
        else if (username === 'admin') userRole = 'admin';

        // DASHBOARD
        document.querySelector('.dashboard').innerHTML = `
            <h3>Sesión activa</h3>
            <p><strong>Usuario:</strong> ${username}</p>
            <p><strong>Rol:</strong> <span class="badge bg-primary">${userRole.toUpperCase()}</span></p>
        `;

        // MAIN AREA POR ROL
        const mainArea = document.querySelector('.main-area');
        if (userRole === 'reservas') {
            mainArea.innerHTML = `<h3>Área de Trabajo</h3><div class="alert alert-warning"><h2 class="alert-heading mb-0"><i class="fas fa-tools"></i> Aún estamos en desarrollo del proceso de reservas</h2></div>`;
        } else if (userRole === 'admin') {
            mainArea.innerHTML = `<h3>Área de Trabajo</h3><div class="alert alert-danger"><h2 class="alert-heading mb-0"><i class="fas fa-crown"></i> Yo seré quien controle todo en el futuro</h2></div>`;
        } else { // COMERCIAL - BOTONES ACTIVOS
            renderComercialDashboard(mainArea);
        }
    } else {
        // NO LOGUEADO
        loginOverlay.style.display = 'flex';
        mainApp.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
        loginError.classList.remove('visible');
        usernameInput.focus();
    }
});

// EVENTO USUARIO ULTIMO
usernameInput.oninput = function () {
    this.dataset.lastValue = this.value;
};

// RENDER DASHBOARD COMERCIAL
function renderComercialDashboard(container) {
    container.innerHTML = `
        <h3>Área de Trabajo - Comercial</h3>
        <div class="d-flex gap-3 justify-content-center mb-4 flex-wrap">
            <button class="btn btn-lg btn-primario px-5 py-3 cotizador-btn" id="btn-cotizador">
                <i class="fas fa-calculator me-2"></i>Generar Cotizaciones
            </button>
            <button class="btn btn-lg btn-success px-5 py-3 confirmador-btn" id="btn-confirmador">
                <i class="fas fa-check-circle me-2"></i>Generar Confirmación
            </button>
        </div>
        <p class="lead text-muted text-center">Herramientas integradas listas.</p>
    `;

    document.getElementById('btn-cotizador').onclick = () => loadCotizadorUI(container);
    document.getElementById('btn-confirmador').onclick = () => loadConfirmadorUI(container);
}

// LOGICA CARGA CONFIRMADOR UI
function loadConfirmadorUI(container) {
    const template = document.getElementById('confirmador-main-template');
    if (!template) {
        console.error('Template del confirmador no encontrado');
        return;
    }
    container.innerHTML = '';
    container.appendChild(template.content.cloneNode(true));
    initializeConfirmador(container);
}

// LOGICA CARGA COTIZADOR UI
function loadCotizadorUI(container) {
    const template = document.getElementById('cotizador-main-template');
    if (!template) {
        console.error('Template del cotizador no encontrado');
        return;
    }

    // Limpiar contenedor y montar template
    container.innerHTML = '';
    container.appendChild(template.content.cloneNode(true));

    // Iniciar lógica del cotizador
    initializeCotizador(container);
}

console.log('🛫 Tranquillium - Seguridad máxima activa');


/* =================================================================================
   LÓGICA DEL COTIZADOR (INTEGRADA)
   ================================================================================= */
function initializeCotizador(container) {
    // --- BOTÓN VOLVER ---
    const backBtn = document.getElementById('back-to-dashboard-btn');
    if (backBtn) {
        backBtn.onclick = () => {
            if (confirm('¿Seguro que quieres salir? Se perderán los datos no guardados.')) {
                renderComercialDashboard(container);
            }
        };
    }

    // CONSTANTES Y DATOS
    const ADVISORS = {
        'María_Camila': { name: 'María Camila Ramirez Rodas', photoUrl: 'https://i.imgur.com/SdubRgH.jpeg', defaultWhatsapp: '573113173286' },
        'Sarah_George': { name: 'Sarah George Esteves', photoUrl: 'https://i.imgur.com/MCSsvz9.jpeg', defaultWhatsapp: '573332313485' },
        'Ana_Isabel': { name: 'Ana Isabel Buitrago García', photoUrl: 'https://i.imgur.com/b7LIglY.jpeg', defaultWhatsapp: '573217598780' },
        'Nicol_Dayanna': { name: 'Nicol Dayanna Tamayo Buitrago', photoUrl: 'https://i.imgur.com/7diSD8P.jpeg', defaultWhatsapp: '573003895626' },
        'Alejandra_Arroyo': { name: 'Alejandra Arroyo García', photoUrl: 'https://i.imgur.com/aeMOvMs.jpeg', defaultWhatsapp: '573137449530' }
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
        flight: `<h3>✈️ Tiquetes Aéreos</h3><ul><li>Los valores e itinerarios cotizados están sujetos a cambios y disponibilidad por parte de las aerolíneas sin previo aviso.</li><li>Los vuelos incluidos en esta cotización son aproximados al momento de su emisión.</li><li>Para garantizar el valor y el itinerario proporcionado, se debe realizar el <strong>pago total inmediato</strong>.</li><li>Ninguna aerolínea permite separar, reservar o congelar precios sin el pago completo.</li><li>En caso de cambio de fecha, nombre del pasajero o cualquier modificación, la aerolínea aplicará penalidades según su política interna.</li><li>Niños mayores de 2 años cumplidos pagan tarifa de adulto.</li><li>Los tiquetes se emiten en tarifa básica, la cual incluye únicamente un <strong>artículo personal</strong> (mochila o bolso pequeño). Si deseas adicionar equipaje de mano o de bodega, se podrá incluir posteriormente o solicitar con anticipación. Ten en cuenta que esto genera un costo adicional.</li></ul>`,
        hotel: `<h3>🏨 Hoteles</h3><ul><li>La reserva hotelera se realiza inicialmente con un pago parcial (separación). El saldo restante deberá estar completamente pagado al menos <strong>45 días antes</strong> de la fecha del viaje.</li><li>Si deseas modificar la fecha del viaje, se validará primero la disponibilidad en el hotel. En caso de no estar disponible, se intentará mantener el valor en otro hotel de la misma categoría.</li><li>Si la nueva fecha corresponde a temporada alta y el valor se incrementa, el cliente deberá asumir la diferencia.</li><li>Niños mayores de 6 años pagan estadía en la mayoría de hoteles, de acuerdo con sus políticas.</li><li>En caso de que la garantía de 12 meses no sea suficiente y desees extenderla hasta 18 meses, esta extensión está sujeta a aprobación y puede implicar penalidades o ajustes de tarifa.</li><li>Se permite el cambio de titular de la reserva, siempre y cuando el titular actual lo autorice por escrito y el nuevo titular acepte los términos y condiciones vigentes.</li><li>Si decides cambiar de un destino internacional a uno nacional y el valor de la separación inicial supera $1.500.000 COP, este valor será dividido para aplicar a dos destinos nacionales.</li></ul>`,
        transfers: `<h3>🚐 Traslados</h3><ul><li>Si el plan incluye traslados desde el aeropuerto de Punta Cana al hotel en Punta Cana y posteriormente decides comprar vuelos con llegada a Santo Domingo, los traslados adicionales correrán por cuenta del cliente. Esto debido a la diferencia de distancia entre ambas ciudades y el reajuste necesario en la logística.</li></ul>`
    };

    const REGIMEN_TEMPLATES = {
        'todo_incluido': `Todo incluido: Desayunos, almuerzos, cenas, snacks y bebidas ilimitadas.`,
        'pension_completa': `Pensión Completa: Desayuno, almuerzo y cena.`,
        'media_pension': `Media Pensión: Desayuno y cena.`,
        'desayuno': `Alojamiento y Desayuno.`,
        'solo_hotel': `Solo alojamiento.`
    };

    // VARIABLES ESTADO
    let pastedImages = {};
    let hotelCounter = 0;

    // REFERENCIAS DOM
    const form = document.getElementById('pre-reserva-form');
    const formTitleSection = document.getElementById('form-title-section');
    const formSection = document.getElementById('form-section');
    const confirmationSection = document.getElementById('confirmation-section');
    const processQuoteBtn = document.getElementById('process-quote-btn');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const editQuoteBtn = document.getElementById('edit-quote-btn');
    const loaderOverlay = document.getElementById('loader-overlay');
    const dynamicComponentsContainer = document.getElementById('dynamic-components-container');
    const confirmationComponentsContainer = document.getElementById('confirmation-components-container');
    const advisorSelect = document.getElementById('asesor');
    const advisorWhatsappInput = document.getElementById('whatsapp-asesor');

    const requiredFieldsConfig = {
        'flights': ['ciudad-salida', 'flight-1-airline', 'flight-1-price'],
        'tours': ['tour-1-name', 'tour-1-price'],
        'transfers': ['transfer-1-desc', 'transfer-1-price']
    };

    // FUNCIONES AUXILIARES
    function addSection(sectionKey) {
        if (sectionKey === 'hotel') {
            hotelCounter++;
            const template = document.getElementById('template-hotel');
            if (!template) return;

            let cloneHtml = template.innerHTML.replace(/PLACEHOLDER/g, hotelCounter);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cloneHtml;
            const cloneNode = tempDiv.firstElementChild;

            dynamicComponentsContainer.appendChild(cloneNode);

            // Poblar selects
            const nightsSelect = document.getElementById(`cantidad-noches-${hotelCounter}`);
            for (let i = 1; i <= 30; i++) {
                const option = new Option(`${i} noche${i > 1 ? 's' : ''}`, i);
                if (i === 4) option.selected = true;
                nightsSelect.add(option);
            }
            const roomsSelect = document.getElementById(`cantidad-habitaciones-${hotelCounter}`);
            for (let i = 1; i <= 10; i++) {
                const option = new Option(`${i} habitación${i > 1 ? 'es' : ''}`, i);
                if (i === 1) option.selected = true;
                roomsSelect.add(option);
            }

            addEventListenersToSection(cloneNode);

            if (hotelCounter === 1) {
                const btn = document.querySelector(`.add-section-btn[data-section="hotel"]`);
                if (btn) btn.style.display = 'none';
            }
            if (hotelCounter > 1) {
                const prevBtn = document.querySelector(`#hotel-form-wrapper-${hotelCounter - 1} .add-subsection-btn`);
                if (prevBtn) prevBtn.style.display = 'none';
            }
        } else {
            const template = document.getElementById(`template-${sectionKey}`);
            if (!template) return;
            const clone = template.content.cloneNode(true);
            dynamicComponentsContainer.appendChild(clone);
            addEventListenersToSection(dynamicComponentsContainer.querySelector(`#${sectionKey}-form-wrapper`));

            const btn = document.querySelector(`.add-section-btn[data-section="${sectionKey}"]`);
            if (btn) btn.style.display = 'none';

            updateRequiredFields(sectionKey, true);
        }
    }

    function removeSection(sectionKey) {
        if (sectionKey.startsWith('hotel-')) {
            const wrapper = document.getElementById(`hotel-form-wrapper-${sectionKey.split('-')[1]}`);
            if (wrapper) {
                wrapper.remove();
                if (document.querySelectorAll('.hotel-form-wrapper').length === 0) {
                    const btn = document.querySelector(`.add-section-btn[data-section="hotel"]`);
                    if (btn) btn.style.display = 'block';
                    hotelCounter = 0;
                } else {
                    const lastHotel = Array.from(document.querySelectorAll('.hotel-form-wrapper')).pop();
                    const btn = lastHotel.querySelector('.add-subsection-btn');
                    if (btn) btn.style.display = 'block';
                }
            }
        } else {
            const originalWrapper = document.getElementById(`${sectionKey}-form-wrapper`);
            if (originalWrapper) {
                originalWrapper.remove();
                const btn = document.querySelector(`.add-section-btn[data-section="${sectionKey}"]`);
                if (btn) btn.style.display = 'block';
                updateRequiredFields(sectionKey, false);
            }
        }
    }

    function addSubSection(subSectionKey) {
        if (subSectionKey === 'hotel') addSection('hotel');
        else {
            const wrapper = document.getElementById(`${subSectionKey}-form-wrapper`);
            if (wrapper) {
                wrapper.style.display = 'block';
                const btn = document.querySelector(`.add-subsection-btn[data-subsection="${subSectionKey}"]`);
                if (btn) btn.style.display = 'none';
                updateRequiredFields(subSectionKey, true);
            }
        }
    }

    function removeSubSection(subSectionKey) {
        const wrapper = document.getElementById(`${subSectionKey}-form-wrapper`);
        if (wrapper) {
            wrapper.style.display = 'none';
            wrapper.querySelectorAll('input').forEach(input => input.value = '');
            const btn = document.querySelector(`.add-subsection-btn[data-subsection="${subSectionKey}"]`);
            if (btn) btn.style.display = 'block';
            updateRequiredFields(subSectionKey, false);
        }
    }

    function updateRequiredFields(key, isRequired) {
        (requiredFieldsConfig[key] || []).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.required = isRequired;
        });
    }

    // HANDLERS EVENTOS
    form.onclick = e => {
        const { target } = e;
        const { section, subsection } = target.dataset;
        if (target.matches('.add-section-btn')) addSection(section);
        if (target.matches('.remove-section-btn')) {
            if (target.dataset.subsection) {
                removeSubSection(target.dataset.subsection);
            } else {
                removeSection(section);
            }
        }
        if (target.matches('.add-subsection-btn')) addSubSection(section || subsection);
    };

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
                previewImg.src = base64Image;
                previewImg.style.display = 'block';
                pasteArea.querySelector('p').style.display = 'none';
                pastedImages[imageId] = base64Image;
            };
            reader.readAsDataURL(item.getAsFile());
        }
    }

    function addEventListenersToSection(sectionElement) {
        if (!sectionElement) return;
        sectionElement.querySelectorAll('.paste-area').forEach(area => area.addEventListener('paste', handlePaste));
    }

    function populateMainDropdowns() {
        const adultsSelect = document.getElementById('adultos');
        const ninosSelect = document.getElementById('ninos');
        if (adultsSelect.options.length === 0) {
            for (let i = 1; i <= 20; i++) {
                const option = new Option(i, i);
                if (i === 2) option.selected = true;
                adultsSelect.add(option);
            }
        }
        if (ninosSelect.options.length === 0) {
            for (let i = 0; i <= 10; i++) {
                const text = i === 0 ? '0' : (i === 1 ? '1 niño' : `${i} niños`);
                ninosSelect.add(new Option(text, i));
            }
        }
    }

    function initializeForm() {
        form.reset();
        pastedImages = {};
        hotelCounter = 0;
        dynamicComponentsContainer.innerHTML = '';

        // Reset botones añadir
        const addBtns = form.querySelectorAll('.add-section-btn');
        addBtns.forEach(btn => btn.style.display = 'block');

        // Asesores
        advisorSelect.innerHTML = '<option value="" disabled selected>Selecciona tu nombre</option>' + Object.keys(ADVISORS).map(id => `<option value="${id}">${ADVISORS[id].name}</option>`).join('');
        advisorSelect.dispatchEvent(new Event('change'));

        populateMainDropdowns();

        const now = new Date();
        const cotNum = document.getElementById('cotizacion-numero');
        if (cotNum) cotNum.value = `COT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    }

    advisorSelect.onchange = () => {
        const selectedAdvisor = ADVISORS[advisorSelect.value];
        if (selectedAdvisor) advisorWhatsappInput.value = selectedAdvisor.defaultWhatsapp;
    };

    function validateForm() {
        if (!form.checkValidity()) {
            form.reportValidity();
            alert('Por favor, completa todos los campos obligatorios.');
            return false;
        }
        if (dynamicComponentsContainer.children.length === 0) {
            alert('Debes añadir al menos un componente.');
            return false;
        }
        return true;
    }

    const toggleLoader = (show, text = "Generando PDF...") => {
        if (loaderOverlay) {
            loaderOverlay.style.display = show ? 'flex' : 'none';
            const txt = loaderOverlay.querySelector('#loader-text');
            if (txt) txt.textContent = text;
        }
    };

    function formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function formatCurrency(value, currency = 'COP') {
        const number = parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
        if (isNaN(number) || !String(value).trim()) return '';
        return number.toLocaleString(currency === 'COP' ? 'es-CO' : 'en-US', { style: 'currency', currency, minimumFractionDigits: currency === 'COP' ? 0 : 2, maximumFractionDigits: currency === 'COP' ? 0 : 2 });
    }

    function populateQuote() {
        const advisorKey = advisorSelect.value;
        const advisor = ADVISORS[advisorKey];
        const advisorWhatsapp = advisorWhatsappInput.value;
        const clientName = document.getElementById('nombre-completo').value;
        const quoteNumber = document.getElementById('cotizacion-numero').value;
        const adults = document.getElementById('adultos').value;
        const children = document.getElementById('ninos').value;

        document.getElementById('confirm-intro-text').textContent = `¡Hola, ${clientName.split(' ')[0].toUpperCase()}! He preparado estas opciones para tu próximo viaje.`;

        const customerBox = document.getElementById('confirm-customer-data-box');
        customerBox.innerHTML = `<p>Para: <strong>${clientName.toUpperCase()}</strong></p><p>Pasajeros: <strong>${adults} Adulto${adults > 1 ? 's' : ''}${children > 0 ? ` y ${children} Niño${children > 1 ? 's' : ''}` : ''}</strong></p><p>Nº Cotización: <strong>${quoteNumber}</strong> | Validez: <strong>${document.getElementById('validez-cupos').value}</strong></p>`;

        document.getElementById('advisor-photo').src = advisor.photoUrl;
        document.getElementById('advisor-name').textContent = advisor.name;

        const whatsappLink = `https://wa.me/${advisorWhatsapp}`;
        const whatsappLinksIds = ['advisor-whatsapp-btn', 'cta-reservar', 'cta-contactar', 'footer-wpp-link'];
        whatsappLinksIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const baseText = id === 'cta-reservar' ? `¡Hola ${advisor.name}! Estoy listo para reservar según la cotización *${quoteNumber}*.` : `Hola ${advisor.name}, tengo una pregunta sobre la cotización *${quoteNumber}*.`;
            el.href = `${whatsappLink}?text=${encodeURIComponent(baseText)}`;
        });

        confirmationComponentsContainer.innerHTML = '';

        // Hoteles
        const hotelForms = document.querySelectorAll('.hotel-form-wrapper');
        hotelForms.forEach((form, index) => {
            const num = form.id.match(/\d+/)[0];
            let galleryHTML = [1, 2, 3].map(i => pastedImages[`hotel-${num}-foto-${i}`] ? `<img src="${pastedImages[`hotel-${num}-foto-${i}`]}">` : '').join('');
            let hotelDetailsHTML = `
                <div class="data-item">${ICONS.destination}<div class="data-item-content"><strong>Destino:</strong><p>${document.getElementById(`destino-${num}`).value}</p></div></div>
                <div class="data-item">${ICONS.calendar}<div class="data-item-content"><strong>Fechas:</strong><p>${formatDate(document.getElementById(`fecha-viaje-${num}`).value)}</p></div></div>
                <div class="data-item">${ICONS.moon}<div class="data-item-content"><strong>Noches:</strong><p>${document.getElementById(`cantidad-noches-${num}`).options[document.getElementById(`cantidad-noches-${num}`).selectedIndex].text}</p></div></div>
                <div class="data-item">${ICONS.bed}<div class="data-item-content"><strong>Habitaciones:</strong><p>${document.getElementById(`cantidad-habitaciones-${num}`).options[document.getElementById(`cantidad-habitaciones-${num}`).selectedIndex].text}</p></div></div>`;

            confirmationComponentsContainer.innerHTML += `
                <div class="quote-option-box">
                    <div class="option-header"><h3>Hotel ${index + 1}</h3><span class="option-price">${formatCurrency(document.getElementById(`valor-total-${num}`).value, document.getElementById(`moneda-${num}`).value)}</span></div>
                    <div class="option-body">
                        <h4>${document.getElementById(`hotel-${num}`).value}</h4>
                        <div class="photo-gallery">${galleryHTML || '<p>No se añadieron imágenes.</p>'}</div>
                        <div class="details-grid">
                            ${hotelDetailsHTML}
                            <div class="data-item full-width">${ICONS.check}<div class="data-item-content"><strong>Plan Incluye:</strong><p>${REGIMEN_TEMPLATES[document.getElementById(`regimen-${num}`).value] || 'No especificado'}</p></div></div>
                        </div>
                    </div>
                </div>`;
        });

        // Vuelos
        if (document.getElementById('flights-form-wrapper')) {
            const departureCity = document.getElementById('ciudad-salida').value;
            let optionsHTML = [1, 2].map(i => {
                const wrapper = document.getElementById(`flight-${i}-form-wrapper`);
                if ((i === 1 || (wrapper && wrapper.style.display !== 'none')) && document.getElementById(`flight-${i}-airline`)) {
                    const airline = document.getElementById(`flight-${i}-airline`).value; const price = document.getElementById(`flight-${i}-price`).value;
                    if (airline && price) return `<div class="item-option"><strong>Opción ${i}:</strong> ${airline} <span class="item-price">Desde ${formatCurrency(price)}</span></div>`;
                } return '';
            }).join('');
            confirmationComponentsContainer.innerHTML += `<div class="component-section"><h3>Vuelos Sugeridos</h3>${pastedImages['flight-banner-preview'] ? `<div class="flight-banner"><img src="${pastedImages['flight-banner-preview']}"></div>` : ''}<div id="flight-options-confirm-container"><div class="data-item">${ICONS.plane}<div class="data-item-content"><strong>Desde:</strong><p>${departureCity}</p></div></div>${optionsHTML}</div><p class="item-disclaimer">*Valores por persona, sujetos a cambio.</p></div>`;
        }

        // Tours y Traslados
        ['tours', 'transfers'].forEach(type => {
            if (document.getElementById(`${type}-form-wrapper`)) {
                const imgHTML = pastedImages[`${type.slice(0, -1)}-main-photo`] ? `<div class="single-photo-container"><img src="${pastedImages[`${type.slice(0, -1)}-main-photo`]}"></div>` : '';
                const nameKey = type === 'tours' ? 'name' : 'desc';
                const desc = document.getElementById(`${type.slice(0, -1)}-1-${nameKey}`).value; const price = document.getElementById(`${type.slice(0, -1)}-1-price`).value;
                confirmationComponentsContainer.innerHTML += `<div class="component-section"><h3>${type === 'tours' ? 'Tours Opcionales' : 'Traslados'}</h3><div class="option-body">${imgHTML}<div class="item-option">${desc}<span class="item-price">Desde ${formatCurrency(price)}</span></div></div></div>`;
            }
        });

        document.getElementById('confirm-pago-reserva').textContent = formatCurrency(document.getElementById('pago-reserva').value);
        document.getElementById('confirm-pago-segundo').textContent = formatCurrency(document.getElementById('pago-segundo').value);
        document.getElementById('confirm-fecha-limite').textContent = document.getElementById('fecha-limite-pago').value;
        document.getElementById('confirm-no-incluye').textContent = document.getElementById('no-incluye').value;

        // Términos
        let termsHTML = '';
        if (document.querySelector('.hotel-form-wrapper')) termsHTML += TERMS_AND_CONDITIONS.hotel;
        if (document.getElementById('flights-form-wrapper')) termsHTML += TERMS_AND_CONDITIONS.flight;
        if (document.getElementById('transfers-form-wrapper')) termsHTML += TERMS_AND_CONDITIONS.transfers;

        const termsContainer = document.getElementById('terms-section-confirm');
        if (termsHTML) {
            document.getElementById('confirm-terms-content').innerHTML = termsHTML;
            termsContainer.style.display = 'block';
        } else {
            termsContainer.style.display = 'none';
        }
    }

    async function processQuote() {
        toggleLoader(true, "Generando PDF...");
        processQuoteBtn.disabled = true;
        try {
            const elementToPrint = document.getElementById('voucher-to-print');
            const canvas = await html2canvas(elementToPrint, { scale: 2, useCORS: true, logging: true });
            const pdf = new window.jspdf.jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, canvas.width, canvas.height);

            const scaleFactor = canvas.width / elementToPrint.offsetWidth;
            ['advisor-whatsapp-btn', 'cta-reservar', 'cta-contactar', 'footer-wpp-link'].forEach(id => {
                const element = document.getElementById(id); if (!element || !element.href) return;
                const rect = element.getBoundingClientRect(); const containerRect = elementToPrint.getBoundingClientRect();
                pdf.link((rect.left - containerRect.left) * scaleFactor, (rect.top - containerRect.top) * scaleFactor, rect.width * scaleFactor, rect.height * scaleFactor, { url: element.href });
            });

            pdf.save(`Cotizacion_${document.getElementById('cotizacion-numero').value}_${document.getElementById('nombre-completo').value.replace(/ /g, '_')}.pdf`);
            alert("¡ÉXITO!\n\nLa cotización ha sido descargada en tu equipo.");

        } catch (error) { console.error("Error en el proceso:", error); alert(`Hubo un error: ${error.message}`); }
        finally { toggleLoader(false); processQuoteBtn.disabled = false; }
    }

    // EVENTOS PRINCIPALES
    form.onsubmit = e => {
        e.preventDefault();
        if (!validateForm()) return;
        populateQuote();
        formTitleSection.style.display = 'none';
        formSection.style.display = 'none';
        confirmationSection.style.display = 'block';
        window.scrollTo(0, 0);
    };

    if (processQuoteBtn) processQuoteBtn.onclick = processQuote;

    if (newQuoteBtn) newQuoteBtn.onclick = () => {
        confirmationSection.style.display = 'none';
        formTitleSection.style.display = 'block';
        formSection.style.display = 'block';
        initializeForm();
        window.scrollTo(0, 0);
    };

    if (editQuoteBtn) editQuoteBtn.onclick = () => {
        confirmationSection.style.display = 'none';
        formTitleSection.style.display = 'block';
        formSection.style.display = 'block';
        window.scrollTo(0, 0);
    };


    // Iniciar con formulario limpio
    initializeForm();
}


/* =================================================================================
   LÓGICA DEL CONFIRMADOR (INTEGRADA)
   ================================================================================= */
function initializeConfirmador(container) {
    // Referencias
    const form = document.getElementById('pre-reserva-form');
    const formTitleSection = document.getElementById('form-title-section');
    const formSection = document.getElementById('form-section');
    const confirmationSection = document.getElementById('confirmation-section');
    const processBtn = document.getElementById('process-voucher-btn');
    const newVoucherBtn = document.getElementById('new-voucher-btn');
    const backBtn = document.getElementById('back-to-dashboard-confirm-btn');

    // Boton Volver
    if (backBtn) {
        backBtn.onclick = () => {
            if (confirm('¿Seguro que quieres salir? Se perderán los datos no guardados.')) {
                renderComercialDashboard(container);
            }
        };
    }

    const toggleLoader = (show, text = "Generando PDF...") => {
        const loader = document.getElementById('loader-overlay');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
            const txt = loader.querySelector('#loader-text') || loader.querySelector('p');
            if (txt) txt.textContent = text;
        }
    };

    function formatDate(dateStr) {
        if (!dateStr) return 'Fecha no válida';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function populateVoucher() {
        const data = {
            destino: document.getElementById('destino').value,
            nombre: document.getElementById('nombre-completo').value,
            documento: document.getElementById('documento').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            direccion: document.getElementById('direccion').value,
            fechaInput: document.getElementById('fecha-viaje').value,
            noches: document.getElementById('cantidad-noches').value,
            hotel: document.getElementById('hotel').value,
            localizador: document.getElementById('localizador').value || 'Pendiente',
            habitaciones: document.getElementById('cantidad-habitaciones').value,
            regimen: document.getElementById('regimen').value,
            acompanantes: document.getElementById('acompanantes').value,
            observaciones: document.getElementById('observaciones').value,
        };

        const nochesInt = parseInt(data.noches, 10);
        const checkInDate = new Date(data.fechaInput + 'T00:00:00');
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + nochesInt);

        const habitacionesInt = parseInt(data.habitaciones, 10);
        const habitacionesTexto = `${habitacionesInt} ${habitacionesInt > 1 ? 'habitaciones' : 'habitación'}`;

        let planDescription = '';
        switch (data.regimen) {
            case 'Solo hotel': planDescription = '<strong>Plan Incluye:</strong> Alojamiento según las noches estipuladas.'; break;
            case 'Hotel y desayuno': planDescription = '<strong>Plan Incluye:</strong> Alojamiento y Desayuno diario.'; break;
            case 'Media Pensión': planDescription = '<strong>Plan Incluye:</strong> Alojamiento, Desayuno y una comida principal.'; break;
            case 'Pensión Completa': planDescription = '<strong>Plan Incluye:</strong> Alojamiento, Desayuno, Almuerzo, Cena y Snacks.'; break;
            case 'Todo incluido': planDescription = '<strong>Plan Incluye:</strong> Alojamiento, todas las comidas, bebidas y snacks ilimitados.'; break;
        }

        document.getElementById('confirm-nombre-intro').textContent = data.nombre;
        document.getElementById('confirm-destino').textContent = data.destino;
        document.getElementById('confirm-hotel').textContent = data.hotel;
        document.getElementById('confirm-localizador').textContent = data.localizador;
        document.getElementById('confirm-regimen').textContent = data.regimen;
        document.getElementById('confirm-habitaciones').textContent = habitacionesTexto;

        document.getElementById('confirm-nombre').textContent = data.nombre;
        document.getElementById('confirm-documento').textContent = data.documento;
        document.getElementById('confirm-telefono').textContent = data.telefono;
        document.getElementById('confirm-email').textContent = data.email;
        document.getElementById('confirm-direccion').textContent = data.direccion.trim() || 'No especificada';
        document.getElementById('confirm-acompanantes').textContent = data.acompanantes.trim() || 'No especificado';

        document.getElementById('confirm-checkin').textContent = formatDate(data.fechaInput);
        document.getElementById('confirm-checkout').textContent = formatDate(checkOutDate.toISOString().split('T')[0]);
        document.getElementById('confirm-noches').textContent = `${nochesInt} ${nochesInt > 1 ? 'noches' : 'noche'}`;

        document.getElementById('confirm-observaciones').textContent = data.observaciones.trim() || 'Ninguna';
        document.getElementById('confirm-valor-restante').textContent = 'PAGADO EN SU TOTALIDAD';
        document.getElementById('confirm-plan-incluye').innerHTML = planDescription;

        document.getElementById('footer-wpp-link').href = `https://wa.me/3137449530`;
    }

    async function processVoucher() {
        toggleLoader(true, "Generando PDF...");
        processBtn.disabled = true;
        try {
            const elementToPrint = document.getElementById('voucher-to-print');
            const canvas = await html2canvas(elementToPrint, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/jpeg', 0.9);

            const pdf = new window.jspdf.jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
            pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

            // Enlaces
            const scaleFactor = canvas.width / elementToPrint.offsetWidth;
            const linkEl = document.getElementById('footer-wpp-link');
            if (linkEl) {
                const rect = linkEl.getBoundingClientRect();
                const containerRect = elementToPrint.getBoundingClientRect();
                pdf.link((rect.left - containerRect.left) * scaleFactor, (rect.top - containerRect.top) * scaleFactor, rect.width * scaleFactor, rect.height * scaleFactor, { url: linkEl.href });
            }

            const nombreCliente = document.getElementById('nombre-completo').value;
            pdf.save(`Confirmacion_${nombreCliente.replace(/ /g, '_')}.pdf`);

            alert("¡Éxito! El PDF ha sido generado y descargado.");

        } catch (error) {
            console.error("Error PDF:", error);
            alert("Error generando PDF. Ver consola.");
        } finally {
            toggleLoader(false);
            processBtn.disabled = false;
        }
    }

    form.onsubmit = (event) => {
        event.preventDefault();
        populateVoucher();
        formTitleSection.style.display = 'none';
        formSection.style.display = 'none';
        confirmationSection.style.display = 'block';
        window.scrollTo(0, 0);
    };

    if (processBtn) processBtn.onclick = processVoucher;

    if (newVoucherBtn) newVoucherBtn.onclick = (e) => {
        e.preventDefault();
        confirmationSection.style.display = 'none';
        formTitleSection.style.display = 'block';
        formSection.style.display = 'block';
        form.reset();
        window.scrollTo(0, 0);
    };

    // Set min date
    const fechaViaje = document.getElementById('fecha-viaje');
    if (fechaViaje) fechaViaje.min = new Date().toISOString().split("T")[0];
}
