// vista360.js: ventana con la vista 360° de cada producto del catálogo

// cada imagen tiene 36 fotos acomodadas en una tabla de 6 x 6,
// al mostrar una foto tras otra parece que el producto gira
// las imágenes tienen el mismo nombre que la foto del catálogo, pero en .webp
const CARPETA_360 = 'assets/images/360/catalogo/';


// elementos del html
const modal360 = document.querySelector('#modal-360');
const fondo360 = document.querySelector('#modal-360-fondo');
const cerrar360 = document.querySelector('#modal-360-cerrar');
const visor360 = document.querySelector('#visor-360');
const titulo360 = document.querySelector('#modal-360-titulo');
const subtitulo360 = document.querySelector('#modal-360-linea');


// foto que se está mostrando (columna y fila de 0 a 5)
let columna360 = 0;
let fila360 = 0;

// guarda el giro automático, es null cuando la ventana está cerrada
let giro360 = null;


// mueve la imagen para que se vea la foto actual (de 20% en 20%)
function mostrarFoto360() {
  visor360.style.backgroundPosition = (columna360 * 20) + '% ' + (fila360 * 20) + '%';
}

// pasa a la siguiente foto, al llegar al final vuelve al inicio
function siguienteFoto360() {
  columna360 = columna360 + 1;
  if (columna360 === 6) {
    columna360 = 0;
    fila360 = fila360 + 1;
  }
  if (fila360 === 6) {
    fila360 = 0;
  }
  mostrarFoto360();
}

// vuelve a la foto anterior
function fotoAnterior360() {
  columna360 = columna360 - 1;
  if (columna360 === -1) {
    columna360 = 5;
    fila360 = fila360 - 1;
  }
  if (fila360 === -1) {
    fila360 = 5;
  }
  mostrarFoto360();
}


// girar arrastrando con el mouse o con el dedo
// (los eventos "pointer" sirven para los dos)
let arrastrando360 = false;
let ultimoX360 = 0;   // dónde estaba el mouse o el dedo la última vez

// al presionar sobre la imagen
visor360.addEventListener('pointerdown', function (event) {
  arrastrando360 = true;
  ultimoX360 = event.clientX;
  visor360.setPointerCapture(event.pointerId);   // así sigue aunque el mouse se salga del visor
});

// al mover: cada 10 píxeles cambia de foto
visor360.addEventListener('pointermove', function (event) {
  if (arrastrando360 === false) {
    return;
  }
  const diferencia = event.clientX - ultimoX360;

  if (diferencia >= 10) {          // hacia la derecha
    fotoAnterior360();
    ultimoX360 = event.clientX;
  }
  if (diferencia <= -10) {         // hacia la izquierda
    siguienteFoto360();
    ultimoX360 = event.clientX;
  }
});

// al soltar
visor360.addEventListener('pointerup', function () {
  arrastrando360 = false;
});
visor360.addEventListener('pointercancel', function () {
  arrastrando360 = false;
});


// abre la ventana con el producto que tocaron (se llama desde catalogo.js)
function abrirVista360(producto) {

  // misma foto del catálogo pero en .webp, por ejemplo pulsera-roja-iman.jpg queda pulsera-roja-iman.webp
  const nombre = producto.foto.split('.')[0];
  const imagen = nombre + '.webp';

  visor360.style.backgroundImage = "url('" + CARPETA_360 + imagen + "')";
  visor360.setAttribute('aria-label', 'Vista 360° de ' + producto.nombre);
  titulo360.textContent = producto.nombre;
  subtitulo360.textContent = producto.linea;

  // empieza desde la primera foto
  columna360 = 0;
  fila360 = 0;
  mostrarFoto360();

  modal360.classList.remove('hidden');
  modal360.classList.add('flex');

  // gira solo: cambia de foto cada 150 milisegundos (menos mientras lo arrastran)
  giro360 = setInterval(function () {
    if (arrastrando360 === false) {
      siguienteFoto360();
    }
  }, 150);
}

// cierra la ventana y detiene el giro
function cerrarVista360() {
  modal360.classList.add('hidden');
  modal360.classList.remove('flex');
  clearInterval(giro360);
  giro360 = null;
}

cerrar360.addEventListener('click', cerrarVista360);
fondo360.addEventListener('click', cerrarVista360);   // clic en lo oscuro

// la tecla Escape también cierra
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && giro360 !== null) {
    cerrarVista360();
  }
});
