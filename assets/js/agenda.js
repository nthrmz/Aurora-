const eventosAurora = [
  { id:'evt-1', titulo:'Lecturas gratuitas', fecha:'2026-07-15', hora:'16:00', lugar:'Feria Mística del Prado', tipo:'Gratis', descripcion:'Mini lecturas de carta del día para nuevos visitantes. Cupos limitados por orden de llegada.' },
  { id:'evt-2', titulo:'Live Carta del Mes', fecha:'2026-07-22', hora:'20:00', lugar:'Instagram Live', tipo:'Online', descripcion:'Transmisión especial con mensaje energético del mes y lectura colectiva.' },
  { id:'evt-3', titulo:'Taller introductorio', fecha:'2026-07-30', hora:'18:00', lugar:'Casa Cultural Luna', tipo:'Taller', descripcion:'Encuentro introductorio sobre arcanos mayores, símbolos y lectura intuitiva.' },
  { id:'evt-4', titulo:'Sesiones express en feria', fecha:'2026-08-05', hora:'15:30', lugar:'Expo Holística Aurora', tipo:'Feria', descripcion:'Espacio presencial con sesiones express para nuevos clientes y consultas rápidas.' },
  { id:'evt-5', titulo:'Noche de signos zodiacales', fecha:'2026-08-12', hora:'19:30', lugar:'Sala Celeste', tipo:'Especial', descripcion:'Evento temático para revisar la energía de cada signo y su vínculo con el tarot.' }
];
let fechaVisible = new Date('2026-07-01T00:00:00');
let fechaSeleccionada = eventosAurora[0].fecha;

function yyyyMmDd(date){
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}
function renderizarCalendario(){
  const grid = document.getElementById('calendarGrid');
  const title = document.getElementById('calendarTitle');
  if(!grid || !title) return;
  const year = fechaVisible.getFullYear();
  const month = fechaVisible.getMonth();
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = fechaVisible.toLocaleDateString('es-BO', { month:'long', year:'numeric' });
  title.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const heads = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const cells = heads.map(h => `<div class="calendar-head">${h}</div>`);
  for(let i=0; i<startDay; i++) cells.push('<div class="calendar-day muted" aria-hidden="true"></div>');
  for(let day=1; day<=daysInMonth; day++){
    const date = yyyyMmDd(new Date(year, month, day));
    const eventosDia = eventosAurora.filter(e => e.fecha === date);
    cells.push(`
      <button type="button" class="calendar-day ${date === fechaSeleccionada ? 'selected' : ''} ${eventosDia.length ? 'has-event' : ''}" data-date="${date}" aria-label="Ver eventos del ${date}">
        <strong>${day}</strong>
        ${eventosDia.slice(0,2).map(e => `<div class="event-mini">${e.titulo}</div>`).join('')}
      </button>`);
  }
  grid.innerHTML = cells.join('');
  document.querySelectorAll('[data-date]').forEach(day => day.addEventListener('click', () => {
    fechaSeleccionada = day.dataset.date;
    renderizarCalendario();
    renderizarEventosDia();
  }));
}
function eventoHtml(e){
  return `<article class="event-card glass-card p-3 mb-3">
    <div class="d-flex justify-content-between gap-2 flex-wrap">
      <span class="kicker"><i class="fa-solid fa-calendar-check"></i>${e.tipo}</span>
      <span class="text-info fw-bold">${e.hora}</span>
    </div>
    <h4 class="mt-3">${e.titulo}</h4>
    <p class="mb-1"><i class="fa-solid fa-location-dot me-2 text-info"></i>${e.lugar}</p>
    <p class="text-secondary-emphasis mb-0">${e.descripcion}</p>
  </article>`;
}
function renderizarEventosDia(){
  const panel = document.getElementById('selectedEvents');
  const proximos = document.getElementById('nextEvents');
  if(!panel || !proximos) return;
  const eventos = [...eventosAurora].sort((a,b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  const delDia = eventos.filter(e => e.fecha === fechaSeleccionada);
  panel.innerHTML = `
    <h3 class="section-title h4">Eventos del ${new Date(fechaSeleccionada+'T00:00:00').toLocaleDateString('es-BO',{day:'numeric',month:'long',year:'numeric'})}</h3>
    ${delDia.length ? delDia.map(eventoHtml).join('') : '<p class="text-secondary-emphasis">No hay eventos programados en esta fecha.</p>'}`;
  proximos.innerHTML = eventos.slice(0,5).map(e => `
    <div class="event-card glass-card p-3 mb-3">
      <small class="text-info fw-bold">${new Date(e.fecha+'T00:00:00').toLocaleDateString('es-BO',{day:'numeric',month:'short'})} · ${e.hora}</small>
      <h4 class="h6 mt-1 mb-1">${e.titulo}</h4>
      <p class="small text-secondary-emphasis mb-0"><i class="fa-solid fa-location-dot me-1"></i>${e.lugar}</p>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarCalendario();
  renderizarEventosDia();
  document.getElementById('prevMonth')?.addEventListener('click', () => { fechaVisible.setMonth(fechaVisible.getMonth()-1); renderizarCalendario(); });
  document.getElementById('nextMonth')?.addEventListener('click', () => { fechaVisible.setMonth(fechaVisible.getMonth()+1); renderizarCalendario(); });
});
