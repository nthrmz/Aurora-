const comentariosIniciales = [
  { id: crearIdAurora(), nombre:'Valeria', categoria:'Experiencia', comentario:'La lectura de tres cartas me ayudó a ordenar mis ideas antes de tomar una decisión.', estado:'aprobado', fecha:'2026-06-01' },
  { id: crearIdAurora(), nombre:'Mateo', categoria:'Pregunta', comentario:'¿Las lecturas de feria se reservan por horario?', estado:'aprobado', fecha:'2026-06-05' }
];
function obtenerComentarios(){
  const guardados = localStorage.getItem('auroraComentarios');
  if(guardados) return JSON.parse(guardados);
  localStorage.setItem('auroraComentarios', JSON.stringify(comentariosIniciales));
  return comentariosIniciales;
}
function guardarComentarios(data){ localStorage.setItem('auroraComentarios', JSON.stringify(data)); }
function renderizarComentarios(){
  const lista = document.getElementById('commentsList');
  if(!lista) return;
  const filtro = document.getElementById('filterComments')?.value || 'todos';
  const comentarios = obtenerComentarios().filter(c => filtro === 'todos' || c.estado === filtro);
  lista.innerHTML = comentarios.length ? comentarios.map(c => `
    <article class="glass-card forum-card p-4 mb-3">
      <div class="d-flex flex-wrap justify-content-between gap-2 mb-2">
        <div><strong>${c.nombre}</strong> <span class="text-secondary-emphasis">· ${c.categoria}</span></div>
        <span class="comment-status ${c.estado === 'aprobado' ? 'status-approved' : 'status-hidden'}">${c.estado}</span>
      </div>
      <p>${c.comentario}</p>
      <small class="text-secondary-emphasis">${c.fecha}</small>
      <div class="d-flex flex-wrap gap-2 mt-3" aria-label="Moderación de comentario">
        <button class="btn btn-sm btn-outline-success" data-action="aprobado" data-id="${c.id}">Aprobar</button>
        <button class="btn btn-sm btn-outline-warning" data-action="oculto" data-id="${c.id}">Ocultar</button>
        <button class="btn btn-sm btn-outline-danger" data-delete="${c.id}">Eliminar</button>
      </div>
    </article>`).join('') : `<div class="glass-card p-4 text-center">No hay comentarios para este filtro.</div>`;

  document.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', () => cambiarEstado(btn.dataset.id, btn.dataset.action)));
  document.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => eliminarComentario(btn.dataset.delete)));
}
function cambiarEstado(id, estado){
  const data = obtenerComentarios().map(c => c.id === id ? { ...c, estado } : c);
  guardarComentarios(data);
  renderizarComentarios();
}
function eliminarComentario(id){
  guardarComentarios(obtenerComentarios().filter(c => c.id !== id));
  renderizarComentarios();
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarComentarios();
  document.getElementById('filterComments')?.addEventListener('change', renderizarComentarios);
  const form = document.getElementById('commentForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!form.checkValidity()){
      form.classList.add('was-validated');
      return;
    }
    const nuevo = {
      id: crearIdAurora(),
      nombre: document.getElementById('commentName').value.trim(),
      categoria: document.getElementById('commentCategory').value,
      comentario: document.getElementById('commentText').value.trim(),
      estado: 'oculto',
      fecha: new Date().toLocaleDateString('es-BO')
    };
    guardarComentarios([nuevo, ...obtenerComentarios()]);
    form.reset();
    form.classList.remove('was-validated');
    mostrarToast('Comentario enviado. Quedó pendiente de aprobación.');
    renderizarComentarios();
  });
});
