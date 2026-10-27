// carrito.js: el carrito de compras

// cada producto es { clave, nombre, color, dije, precio, cantidad }
// la clave sirve para saber si ya lo habían agregado
let listaCarrito = [];

// nombre con el que se guarda en localStorage
const CLAVE_CARRITO = 'carrito-v2';

// localStorage solo guarda texto, por eso el JSON.stringify
function guardarCarrito() {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(listaCarrito));
}

// lee lo que había guardado, si hay algo
function cargarCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  if (guardado !== null) {
    listaCarrito = JSON.parse(guardado);
  }
}


// elementos del html
const ventanaCarrito = document.querySelector('#carrito');
const fondoCarrito = document.querySelector('#carrito-fondo');
const listaHTMLCarrito = document.querySelector('#carrito-lista');
const totalCarrito = document.querySelector('#carrito-total');
const numeritoCarrito = document.querySelector('#carrito-cantidad');
const inputClienteCarrito = document.querySelector('#carrito-cliente');
const errorCarrito = document.querySelector('#carrito-error');
const botonAbrirCarrito = document.querySelector('#boton-carrito');
const botonCerrarCarrito = document.querySelector('#carrito-cerrar');
const botonPedirCarrito = document.querySelector('#carrito-pedir');
const botonVaciarCarrito = document.querySelector('#carrito-vaciar');


// agregar al carrito, si ya estaba le suma 1
function agregarAlCarrito(pulsera) {

  // -1 significa que no está
  const indice = listaCarrito.findIndex(function (item) {
    return item.clave === pulsera.clave;
  });

  if (indice !== -1) {
    listaCarrito[indice].cantidad = listaCarrito[indice].cantidad + 1;
  } else {
    pulsera.cantidad = 1;
    listaCarrito.push(pulsera);
  }

  guardarCarrito();
  mostrarCarrito();
}

// cambio es 1 para sumar o -1 para restar, si llega a 0 se quita
function cambiarCantidad(clave, cambio) {
  const indice = listaCarrito.findIndex(function (item) {
    return item.clave === clave;
  });

  listaCarrito[indice].cantidad = listaCarrito[indice].cantidad + cambio;

  if (listaCarrito[indice].cantidad === 0) {
    listaCarrito.splice(indice, 1);   // lo quita
  }

  guardarCarrito();
  mostrarCarrito();
}

function vaciarCarrito() {
  listaCarrito = [];
  guardarCarrito();
  mostrarCarrito();
}



// dibuja el carrito, productos, total y el numerito del navbar
function mostrarCarrito() {

  listaHTMLCarrito.innerHTML = '';
  let total = 0;
  let cantidadPulseras = 0;

  if (listaCarrito.length === 0) {
    listaHTMLCarrito.innerHTML = '<li class="py-10 text-center text-stone-500">Tu carrito está vacío.</li>';
  }

  listaCarrito.forEach(function (pulsera) {

    const subtotal = pulsera.precio * pulsera.cantidad;
    total = total + subtotal;
    cantidadPulseras = cantidadPulseras + pulsera.cantidad;

    const elemento = document.createElement('li');
    elemento.className = 'flex items-center justify-between gap-3 rounded-xl border border-guapinol-brown/10 bg-white p-4';
    elemento.innerHTML = `
      <div>
        <p class="font-semibold">${textoSeguro(pulsera.nombre)}</p>
        <p class="text-sm text-stone-500">${textoSeguro(pulsera.color)}, ${textoSeguro(pulsera.dije)}</p>
        <p class="mt-1 text-sm font-medium">${formatoColones(subtotal)}</p>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" class="restar h-8 w-8 rounded-full border border-stone-300 hover:bg-guapinol-cream">-</button>
        <span class="w-5 text-center font-semibold">${pulsera.cantidad}</span>
        <button type="button" class="sumar h-8 w-8 rounded-full border border-stone-300 hover:bg-guapinol-cream">+</button>
      </div>
    `;

    // botones de - y +
    elemento.querySelector('.restar').addEventListener('click', function () {
      cambiarCantidad(pulsera.clave, -1);
    });
    elemento.querySelector('.sumar').addEventListener('click', function () {
      cambiarCantidad(pulsera.clave, 1);
    });

    listaHTMLCarrito.appendChild(elemento);
  });

  totalCarrito.textContent = formatoColones(total);

  // el numerito se esconde si no hay nada
  numeritoCarrito.textContent = cantidadPulseras;
  if (cantidadPulseras === 0) {
    numeritoCarrito.classList.add('hidden');
    numeritoCarrito.classList.remove('flex');
  } else {
    numeritoCarrito.classList.remove('hidden');
    numeritoCarrito.classList.add('flex');
  }
}


// abrir y cerrar el panel
function abrirCarrito() {
  ventanaCarrito.classList.remove('hidden');
}

function cerrarCarrito() {
  ventanaCarrito.classList.add('hidden');
}

botonAbrirCarrito.addEventListener('click', abrirCarrito);
botonCerrarCarrito.addEventListener('click', cerrarCarrito);
fondoCarrito.addEventListener('click', cerrarCarrito);   // clic en lo oscuro


// pedir por whatsapp, revisa que haya productos y nombre, arma el mensaje
botonPedirCarrito.addEventListener('click', function () {

  const nombre = inputClienteCarrito.value.trim();

  if (listaCarrito.length === 0) {
    errorCarrito.textContent = 'Tu carrito está vacío.';
    return;
  }
  if (nombre.length < 3) {
    errorCarrito.textContent = 'Escribe tu nombre para identificar el pedido (mínimo 3 letras).';
    inputClienteCarrito.focus();
    return;
  }
  errorCarrito.textContent = '';

  // una línea por producto y al final el total
  let mensaje = SALUDO + ', quiero hacer este pedido:\n';
  let total = 0;

  listaCarrito.forEach(function (pulsera) {
    const subtotal = pulsera.precio * pulsera.cantidad;
    total = total + subtotal;
    mensaje = mensaje + '- ' + pulsera.cantidad + ' x ' + pulsera.nombre + ' (' + pulsera.color + ', ' + pulsera.dije + ') = ' + formatoColones(subtotal) + '\n';
  });

  mensaje = mensaje + 'Total: ' + formatoColones(total) + '\n';
  mensaje = mensaje + 'A nombre de: ' + nombre;

  enviarWhatsApp(mensaje);   // está en pedidos.js

  //Si pedido se envía, vacía el carrito y cierra la ventana
  vaciarCarrito();
  inputClienteCarrito.value = '';
  cerrarCarrito();
});

botonVaciarCarrito.addEventListener('click', vaciarCarrito);


// al cargar la página
cargarCarrito();
mostrarCarrito();