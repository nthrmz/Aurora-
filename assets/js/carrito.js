function renderizarCarrito(){
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById('cartContent');
  const resumen = document.getElementById('cartSummary');
  if(!contenedor || !resumen) return;

  if(carrito.length === 0){
    contenedor.innerHTML = `
      <div class="glass-card p-5 text-center">
        <i class="fa-solid fa-cart-shopping fa-3x text-info mb-3" aria-hidden="true"></i>
        <h2 class="section-title">Tu carrito está vacío</h2>
        <p class="text-secondary-emphasis">Agrega una lectura para iniciar tu reserva astral.</p>
        <a href="lecturas.html" class="btn btn-aurora">Ver lecturas</a>
      </div>`;
    resumen.innerHTML = '';
    return;
  }

  contenedor.innerHTML = `
    <div class="cart-table table-responsive">
      <table class="table align-middle">
        <thead><tr><th>Lectura</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>
          ${carrito.map(item => `
            <tr>
              <td><strong>${item.nombre}</strong><br><small class="text-secondary-emphasis">${item.descripcion}</small></td>
              <td>Bs ${item.precio}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <button class="qty-btn" data-qty="-1" data-id="${item.id}" aria-label="Restar ${item.nombre}">-</button>
                  <strong>${item.cantidad}</strong>
                  <button class="qty-btn" data-qty="1" data-id="${item.id}" aria-label="Sumar ${item.nombre}">+</button>
                </div>
              </td>
              <td>Bs ${item.precio * item.cantidad}</td>
              <td><button class="btn btn-sm btn-outline-danger" data-remove="${item.id}">Eliminar</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  const total = carrito.reduce((acc,item)=> acc + item.precio * item.cantidad, 0);
  resumen.innerHTML = `
    <aside class="glass-card p-4 sticky-top" style="top:110px">
      <h2 class="section-title h4">Resumen</h2>
      <div class="d-flex justify-content-between border-bottom border-secondary-subtle py-3"><span>Subtotal</span><strong>Bs ${total}</strong></div>
      <div class="d-flex justify-content-between py-3 fs-4"><span>Total</span><strong class="text-info">Bs ${total}</strong></div>
      <button class="btn btn-aurora w-100 mb-2" data-bs-toggle="modal" data-bs-target="#checkoutModal">Finalizar reserva</button>
      <button class="btn btn-outline-aurora w-100" id="vaciarCarrito">Vaciar carrito</button>
    </aside>`;

  document.querySelectorAll('[data-qty]').forEach(btn => btn.addEventListener('click', () => cambiarCantidad(btn.dataset.id, Number(btn.dataset.qty))));
  document.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => eliminarItem(btn.dataset.remove)));
  document.getElementById('vaciarCarrito')?.addEventListener('click', () => { guardarCarrito([]); renderizarCarrito(); });
}
function cambiarCantidad(id, cambio){
  const carrito = obtenerCarrito().map(item => item.id === id ? { ...item, cantidad: item.cantidad + cambio } : item).filter(item => item.cantidad > 0);
  guardarCarrito(carrito);
  renderizarCarrito();
}
function eliminarItem(id){
  guardarCarrito(obtenerCarrito().filter(item => item.id !== id));
  renderizarCarrito();
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrito();
  const form = document.getElementById('checkoutForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!form.checkValidity()){
      form.classList.add('was-validated');
      return;
    }
    guardarCarrito([]);
    renderizarCarrito();
    const modalEl = document.getElementById('checkoutModal');
    const modal = window.bootstrap?.Modal?.getInstance(modalEl);
    modal?.hide();
    mostrarToast('Reserva registrada. Aurora se comunicará contigo pronto.');
    form.reset();
    form.classList.remove('was-validated');
  });
});
