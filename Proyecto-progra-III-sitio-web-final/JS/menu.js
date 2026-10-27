// menu.js: abre y cierra el menú en celular

// elementos del html
const botonMenu = document.querySelector('#boton-menu');
const menuMovil = document.querySelector('#menu-movil');
const iconoAbrir = document.querySelector('#icono-abrir');     // tres rayas
const iconoCerrar = document.querySelector('#icono-cerrar');   // X


// hidden esconde el elemento

// muestra el menú y pone la X
function abrirMenu() {
  menuMovil.classList.remove('hidden');
  iconoAbrir.classList.add('hidden');
  iconoCerrar.classList.remove('hidden');
}

// lo esconde y vuelve a poner las rayas
function cerrarMenu() {
  menuMovil.classList.add('hidden');
  iconoAbrir.classList.remove('hidden');
  iconoCerrar.classList.add('hidden');
}

// el botón abre o cierra según como esté
botonMenu.addEventListener('click', function () {
  if (menuMovil.classList.contains('hidden')) {
    abrirMenu();
  } else {
    cerrarMenu();
  }
});

// si tocan un enlace se cierra el menú
menuMovil.addEventListener('click', function (event) {
  if (event.target.tagName === 'A') {
    cerrarMenu();
  }
});
