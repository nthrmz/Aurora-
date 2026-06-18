
const AURORA_SERVICIOS = [
  { id: 'carta-dia', nombre: 'Carta del día', precio: 20, icono: '☾', descripcion: 'Mensaje breve para orientar tu energía actual.' },
  { id: 'amor', nombre: 'Lectura amor', precio: 50, icono: '♡', descripcion: 'Guía intuitiva sobre vínculos, emociones y decisiones afectivas.' },
  { id: 'laboral', nombre: 'Lectura laboral', precio: 60, icono: '✦', descripcion: 'Orientación sobre estudios, trabajo, dinero y oportunidades.' },
  { id: 'tres-cartas', nombre: 'Tirada 3 cartas', precio: 90, icono: '✧', descripcion: 'Lectura de pasado, presente y futuro con mensaje final.' },
  { id: 'completa', nombre: 'Sesión completa', precio: 150, icono: '★', descripcion: 'Sesión personalizada online con interpretación profunda.' },
  { id: 'feria', nombre: 'Pase feria astral', precio: 35, icono: '♢', descripcion: 'Reserva un turno presencial para eventos y ferias místicas.' }
];

const AURORA_SIGNOS = [
  ['Aries','♈','Impulso, valentía y decisiones.'],
  ['Tauro','♉','Estabilidad, placer y constancia.'],
  ['Géminis','♊','Ideas, comunicación y cambio.'],
  ['Cáncer','♋','Emoción, hogar y sensibilidad.'],
  ['Leo','♌','Brillo personal, liderazgo y corazón.'],
  ['Virgo','♍','Orden, análisis y servicio.'],
  ['Libra','♎','Armonía, vínculos y equilibrio.'],
  ['Escorpio','♏','Transformación, intensidad y profundidad.'],
  ['Sagitario','♐','Expansión, búsqueda y fe.'],
  ['Capricornio','♑','Disciplina, metas y estructura.'],
  ['Acuario','♒','Visión, libertad e innovación.'],
  ['Piscis','♓','Intuición, compasión y espiritualidad.']
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
function actualizarContadorCarrito(){
  const totalItems = obtenerCarrito().reduce((acc,item)=> acc + item.cantidad, 0);
  $$('.cart-count').forEach(el => el.textContent = totalItems);
}
function mostrarToast(mensaje){
  const toastEl = $('#auroraToast');
  if(!toastEl){ alert(mensaje); return; }
  const body = $('.toast-body', toastEl);
  if(body) body.textContent = mensaje;
  toastEl.classList.add('show');
  setTimeout(()=> toastEl.classList.remove('show'), 2600);
}
function agregarAlCarrito(id){
  const servicio = AURORA_SERVICIOS.find(item => item.id === id);
  if(!servicio) return;
  const carrito = obtenerCarrito();
  const existente = carrito.find(item => item.id === id);
  if(existente) existente.cantidad += 1;
  else carrito.push({ ...servicio, cantidad: 1 });
  guardarCarrito(carrito);
  mostrarToast(`${servicio.nombre} se agregó al carrito.`);
}
function cargarServicios(containerId, limit = null){
  const contenedor = document.getElementById(containerId);
  if(!contenedor) return;
  const data = limit ? AURORA_SERVICIOS.slice(0, limit) : AURORA_SERVICIOS;
  contenedor.innerHTML = data.map(servicio => `
    <div class="col-md-6 col-xl-4" data-aos="fade-up">
      <article class="glass-card service-card p-4">
        <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
          <div class="icon-orb" aria-hidden="true">${servicio.icono}</div>
          <span class="price">Bs ${servicio.precio}</span>
        </div>
        <h3 class="h4 section-title">${servicio.nombre}</h3>
        <p class="text-secondary-emphasis mb-4">${servicio.descripcion}</p>
        <button class="btn btn-aurora w-100" type="button" data-add-cart="${servicio.id}">Agregar al carrito</button>
      </article>
    </div>
  `).join('');
  configurarBotonesCompra();
  configurarScrollReveal();
}
function cargarSignos(containerId){
  const contenedor = document.getElementById(containerId);
  if(!contenedor) return;
  contenedor.innerHTML = AURORA_SIGNOS.map(([nombre,icono,clave]) => `
    <div class="col-sm-6 col-md-4 col-xl-3" data-aos="fade-up">
      <article class="zodiac-card">
        <div class="zodiac-symbol" aria-hidden="true">${icono}</div>
        <h3 class="h5 section-title mb-2">${nombre}</h3>
        <p>${clave}</p>
      </article>
    </div>
  `).join('');
  configurarScrollReveal();
}
function configurarBotonesCompra(){
  $$('[data-add-cart]').forEach(btn => {
    if(btn.dataset.ready === 'true') return;
    btn.dataset.ready = 'true';
    btn.addEventListener('click', () => agregarAlCarrito(btn.dataset.addCart));
  });
}
function configurarTema(){
  const saved = localStorage.getItem('auroraTema') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = $('#themeToggle');
  function actualizar(tema){
    if(!btn) return;
    btn.classList.toggle('is-light', tema === 'light');
    btn.classList.toggle('is-dark', tema === 'dark');
    btn.setAttribute('role', 'switch');
    btn.setAttribute('aria-checked', tema === 'light' ? 'true' : 'false');
    btn.setAttribute('aria-label', tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }
  actualizar(saved);
  btn?.addEventListener('click', () => {
    const actual = document.documentElement.getAttribute('data-theme') || 'dark';
    const siguiente = actual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', siguiente);
    localStorage.setItem('auroraTema', siguiente);
    actualizar(siguiente);
  });
}
function configurarNavbar(){
  $$('[data-bs-toggle="collapse"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-bs-target'));
      if(!target) return;
      const open = target.classList.toggle('show');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
}
function configurarCarrusel(){
  $$('.carousel').forEach(carousel => {
    const items = $$('.carousel-item', carousel);
    const indicators = $$('.carousel-indicators button', carousel);
    if(items.length < 2) return;
    let index = Math.max(0, items.findIndex(i => i.classList.contains('active')));
    function go(next){
      items[index].classList.remove('active');
      indicators[index]?.classList.remove('active');
      indicators[index]?.removeAttribute('aria-current');
      index = (next + items.length) % items.length;
      items[index].classList.add('active');
      indicators[index]?.classList.add('active');
      indicators[index]?.setAttribute('aria-current','true');
    }
    carousel.querySelector('[data-bs-slide="prev"]')?.addEventListener('click', () => go(index - 1));
    carousel.querySelector('[data-bs-slide="next"]')?.addEventListener('click', () => go(index + 1));
    indicators.forEach((btn,i) => btn.addEventListener('click', () => go(i)));
    if(carousel.dataset.bsRide === 'carousel') setInterval(() => go(index + 1), 6500);
  });
}
function configurarModal(){
  $$('[data-bs-toggle="modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.querySelector(btn.getAttribute('data-bs-target'));
      modal?.classList.add('show');
      modal?.removeAttribute('aria-hidden');
    });
  });
  $$('[data-bs-dismiss="modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      modal?.classList.remove('show');
      modal?.setAttribute('aria-hidden','true');
    });
  });
  $$('[data-bs-dismiss="toast"]').forEach(btn => btn.addEventListener('click', () => btn.closest('.toast')?.classList.remove('show')));
}
function configurarOraculo(){
  const btn = $('#oracleButton');
  const result = $('#oracleResult');
  if(!btn || !result) return;
  const cartas = [
    ['La Luna','Escucha tu intuición, pero no decidas desde el miedo.'],
    ['La Estrella','Hay una oportunidad de calma y esperanza acercándose a ti.'],
    ['El Sol','Tu energía se abre hacia una etapa más clara y luminosa.'],
    ['La Emperatriz','Cuida lo que estás creando; algo puede crecer con paciencia.'],
    ['La Fuerza','Tu poder está en actuar con calma, no con impulso.']
  ];
  btn.addEventListener('click', () => {
    const [nombre,mensaje] = cartas[Math.floor(Math.random()*cartas.length)];
    result.innerHTML = `<div class="kicker mb-3">Carta revelada</div><h3 class="section-title">${nombre}</h3><p class="mb-0">${mensaje}</p>`;
  });
}
function configurarContacto(){
  const form = $('#contactForm');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!form.checkValidity()){
      form.classList.add('was-validated');
      return;
    }
    form.reset();
    form.classList.remove('was-validated');
    const alertBox = $('#contactAlert');
    if(alertBox) alertBox.style.display = 'block';
    mostrarToast('Tu consulta fue registrada.');
  });
}
function configurarScrollReveal(){
  const elementos = $$('[data-aos]:not(.aos-animate)');
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
  configurarNavbar();
  configurarCarrusel();
  configurarModal();
  configurarBotonesCompra();
  configurarOraculo();
  configurarContacto();
  configurarScrollReveal();
  const year = $('#year');
  if(year) year.textContent = new Date().getFullYear();
  registrarServiceWorker();
});
