const AURORA_SERVICIOS = [
  { id: 'carta-dia', nombre: 'Carta del día', precio: 20, icono: 'fa-moon', descripcion: 'Mensaje breve para orientar tu energía actual.' },
  { id: 'amor', nombre: 'Lectura amor', precio: 50, icono: 'fa-heart', descripcion: 'Guía intuitiva sobre vínculos, emociones y decisiones afectivas.' },
  { id: 'laboral', nombre: 'Lectura laboral', precio: 60, icono: 'fa-briefcase', descripcion: 'Orientación sobre estudios, trabajo, dinero y oportunidades.' },
  { id: 'tres-cartas', nombre: 'Tirada 3 cartas', precio: 90, icono: 'fa-wand-magic-sparkles', descripcion: 'Lectura de pasado, presente y futuro con mensaje final.' },
  { id: 'completa', nombre: 'Sesión completa', precio: 150, icono: 'fa-star', descripcion: 'Sesión personalizada online con interpretación profunda.' },
  { id: 'feria', nombre: 'Pase feria astral', precio: 35, icono: 'fa-ticket', descripcion: 'Reserva un turno presencial para eventos y ferias místicas.' }
];

const AURORA_SIGNOS = [
  { nombre: 'Aries', icono: 'fa-aries', clave: 'Impulso, valentía y decisiones.' },
  { nombre: 'Tauro', icono: 'fa-taurus', clave: 'Estabilidad, placer y constancia.' },
  { nombre: 'Géminis', icono: 'fa-gemini', clave: 'Ideas, comunicación y cambio.' },
  { nombre: 'Cáncer', icono: 'fa-cancer', clave: 'Emoción, hogar y sensibilidad.' },
  { nombre: 'Leo', icono: 'fa-leo', clave: 'Brillo personal, liderazgo y corazón.' },
  { nombre: 'Virgo', icono: 'fa-virgo', clave: 'Orden, análisis y servicio.' },
  { nombre: 'Libra', icono: 'fa-scale-balanced', clave: 'Armonía, vínculos y equilibrio.' },
  { nombre: 'Escorpio', icono: 'fa-scorpio', clave: 'Transformación, intensidad y profundidad.' },
  { nombre: 'Sagitario', icono: 'fa-sagittarius', clave: 'Expansión, búsqueda y fe.' },
  { nombre: 'Capricornio', icono: 'fa-capricorn', clave: 'Disciplina, metas y estructura.' },
  { nombre: 'Acuario', icono: 'fa-aquarius', clave: 'Visión, libertad e innovación.' },
  { nombre: 'Piscis', icono: 'fa-pisces', clave: 'Intuición, compasión y espiritualidad.' }
];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function obtenerCarrito(){
  try { return JSON.parse(localStorage.getItem('auroraCarrito')) || []; }
  catch { return []; }
}
function guardarCarrito(carrito){
  localStorage.setItem('auroraCarrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}
function agregarAlCarrito(id){
  const servicio = AURORA_SERVICIOS.find(item => item.id === id);
  if(!servicio) return;
  const carrito = obtenerCarrito();
  const existente = carrito.find(item => item.id === id);
  if(existente){ existente.cantidad += 1; }
  else { carrito.push({ ...servicio, cantidad: 1 }); }
  guardarCarrito(carrito);
  mostrarToast(`${servicio.nombre} se agregó al carrito.`);
}
function actualizarContadorCarrito(){
  const totalItems = obtenerCarrito().reduce((acc,item)=> acc + item.cantidad, 0);
  $$('.cart-count').forEach(el => el.textContent = totalItems);
}
function mostrarToast(mensaje){
  const toastEl = $('#auroraToast');
  if(!toastEl) return;
  $('.toast-body', toastEl).textContent = mensaje;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
function configurarTema(){
  const saved = localStorage.getItem('auroraTema') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = $('#themeToggle');

  function actualizarSwitchTema(tema){
    if(!btn) return;
    btn.classList.toggle('is-light', tema === 'light');
    btn.classList.toggle('is-dark', tema === 'dark');
    btn.setAttribute('aria-label', tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.setAttribute('aria-checked', tema === 'light' ? 'true' : 'false');
  }

  actualizarSwitchTema(saved);

  if(btn){
    btn.addEventListener('click', () => {
      const actual = document.documentElement.getAttribute('data-theme') || 'dark';
      const siguiente = actual === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', siguiente);
      localStorage.setItem('auroraTema', siguiente);
      actualizarSwitchTema(siguiente);
    });
  }
}
function configurarBotonesCompra(){
  $$('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', () => agregarAlCarrito(btn.dataset.addCart));
  });
}
function cargarServicios(containerId, limit = null){
  const contenedor = document.getElementById(containerId);
  if(!contenedor) return;
  const data = limit ? AURORA_SERVICIOS.slice(0, limit) : AURORA_SERVICIOS;
  contenedor.innerHTML = data.map(servicio => `
    <div class="col-md-6 col-xl-4" data-aos="fade-up">
      <article class="glass-card service-card p-4">
        <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
          <div class="icon-orb"><i class="fa-solid ${servicio.icono}" aria-hidden="true"></i></div>
          <span class="price">Bs ${servicio.precio}</span>
        </div>
        <h3 class="h4 section-title">${servicio.nombre}</h3>
        <p class="text-secondary-emphasis mb-4">${servicio.descripcion}</p>
        <button class="btn btn-aurora w-100" type="button" data-add-cart="${servicio.id}">
          <i class="fa-solid fa-cart-plus me-2" aria-hidden="true"></i>Agregar al carrito
        </button>
      </article>
    </div>
  `).join('');
  configurarBotonesCompra();
}

function cargarSignos(containerId){
  const contenedor = document.getElementById(containerId);
  if(!contenedor) return;
  contenedor.innerHTML = AURORA_SIGNOS.map((signo, index) => `
    <div class="col-6 col-md-4 col-xl-3" data-aos="fade-up" data-aos-delay="${(index % 4) * 60}">
      <article class="zodiac-card">
        <div class="zodiac-symbol"><i class="fa-solid ${signo.icono}" aria-hidden="true"></i></div>
        <h3 class="h5 section-title mb-2">${signo.nombre}</h3>
        <p>${signo.clave}</p>
      </article>
    </div>
  `).join('');
}
function configurarTransicionesPagina(){
  document.body.classList.add('page-ready');
  let overlay = document.querySelector('.page-transition-overlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
  }
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if(!link) return;
    const href = link.getAttribute('href');
    if(!href || href.startsWith('#') || link.target === '_blank' || link.hasAttribute('download')) return;
    if(href.startsWith('mailto:') || href.startsWith('tel:')) return;
    const url = new URL(href, window.location.href);
    if(url.origin !== window.location.origin) return;
    if(url.pathname === window.location.pathname && url.hash) return;
    event.preventDefault();
    document.body.classList.add('page-leave');
    window.setTimeout(() => { window.location.href = url.href; }, 280);
  });
}

function configurarOraculo(){
  const btn = $('#oracleButton');
  const result = $('#oracleResult');
  if(!btn || !result) return;
  const cartas = [
    { nombre:'La Luna', mensaje:'Escucha tu intuición, pero no decidas desde el miedo.' },
    { nombre:'La Estrella', mensaje:'Hay una oportunidad de calma y esperanza acercándose a ti.' },
    { nombre:'El Sol', mensaje:'Tu energía se abre hacia una etapa más clara y luminosa.' },
    { nombre:'La Emperatriz', mensaje:'Cuida lo que estás creando; algo puede crecer con paciencia.' },
    { nombre:'La Fuerza', mensaje:'Tu poder está en actuar con calma, no con impulso.' }
  ];
  btn.addEventListener('click', () => {
    const carta = cartas[Math.floor(Math.random()*cartas.length)];
    result.innerHTML = `
      <div class="kicker mb-3"><i class="fa-solid fa-wand-magic-sparkles"></i> Carta revelada</div>
      <h3 class="section-title">${carta.nombre}</h3>
      <p class="mb-0">${carta.mensaje}</p>
    `;
  });
}
function configurarContacto(){
  const form = $('#contactForm');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    if(!form.checkValidity()){
      e.preventDefault();
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }
    const alerta = $('#contactAlert');
    if(alerta){
      e.preventDefault();
      form.reset();
      form.classList.remove('was-validated');
      alerta.classList.remove('d-none');
    }
  });
}

function configurarScrollReveal(){
  const elementos = $$('[data-aos]');
  if(!elementos.length) return;
  if(!('IntersectionObserver' in window)){
    elementos.forEach(el => el.classList.add('aos-animate'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  elementos.forEach(el => observer.observe(el));
}

function registrarServiceWorker(){
  if('serviceWorker' in navigator){
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  configurarTema();
  actualizarContadorCarrito();
  configurarBotonesCompra();
  configurarOraculo();
  configurarTransicionesPagina();
  configurarContacto();
  const year = $('#year');
  if(year) year.textContent = new Date().getFullYear();
  configurarScrollReveal();
  registrarServiceWorker();
});
