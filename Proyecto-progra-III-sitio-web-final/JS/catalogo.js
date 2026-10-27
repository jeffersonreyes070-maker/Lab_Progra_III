// catalogo.js: productos y filtros

// la dirección del backend (API_URL) está en config.js

// empieza vacío, se llena con los productos que manda el servidor
let PRODUCTOS = [];

// devuelve dónde está la foto de un producto:
// las que se subieron desde el panel ya son una dirección completa (Cloudinary),
// las originales están en la carpeta del sitio
function rutaFoto(foto) {
  if (foto.indexOf('http') === 0) {
    return foto;
  }
  return 'assets/images/catalogo/' + foto;
}

// botones de los filtros, el id es igual a la categoria o al material del producto
const CATEGORIAS = [
  { id: 'todas', texto: 'Todas' },
  { id: 'pulseras', texto: 'Pulseras' },
  { id: 'collares', texto: 'Collares' },
  { id: 'llaveros', texto: 'Llaveros' }
];

const MATERIALES = [
  { id: 'todos', texto: 'Todos' },
  { id: 'Semillas', texto: 'Semillas' },
  { id: 'Madera', texto: 'Madera' },
  { id: 'Macramé', texto: 'Macramé' },
  { id: 'Cuentas', texto: 'Cuentas' }
];

// filtros que estan puestos, cargando la pagina se ven todos los productos 
let filtroCategoria = 'todas';
let filtroMaterial = 'todos';


// elementos del html
const listaCatalogo = document.querySelector('#catalog-grid');
const zonaCategorias = document.querySelector('#catalog-filtros');
const zonaMateriales = document.querySelector('#catalog-materiales');
const contadorCatalogo = document.querySelector('#catalog-total');

// menús desplegables que se ven solo en celular
const selectCategoria = document.querySelector('#select-categoria');
const selectMaterial = document.querySelector('#select-material');


// Dibuja una tarjeta por cada producto que pase los dos filtros
function mostrarCatalogo() {

  listaCatalogo.innerHTML = '';
  let visibles = 0;

  PRODUCTOS.forEach(function (producto) {

    // si no está disponible o no cumple un filtro, lo salta
    if (producto.disponible === false) {
      return;
    }
    if (filtroCategoria !== 'todas' && producto.categoria !== filtroCategoria) {
      return;
    }
    if (filtroMaterial !== 'todos' && producto.material !== filtroMaterial) {
      return;
    }
    visibles = visibles + 1;

    // el precio viene del servidor
    const precio = producto.precio;

    // las fotos subidas desde el panel de administración no tienen vista 360°
    const tiene360 = producto.foto.indexOf('http') !== 0;

    // los datos vienen de la base de datos, se pasan por textoSeguro (pedidos.js) antes de ponerlos en el HTML
    const nombre = textoSeguro(producto.nombre);
    const linea = textoSeguro(producto.linea);

    let foto = `<img src="${textoSeguro(rutaFoto(producto.foto))}" alt="${linea}: ${nombre}" loading="lazy" class="aspect-[3/4] w-full bg-white object-contain">`;
    if (tiene360) {
      foto = `
        <button type="button" class="ver360 group relative block" aria-label="Ver ${nombre} en 360°">
          ${foto}
          <span class="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-stone-900 shadow group-hover:bg-lime-400">360°</span>
        </button>`;
    }

    // ancho fijo para que las filas queden centradas
    const tarjeta = document.createElement('article');
    tarjeta.className = 'flex w-36 flex-col overflow-hidden rounded-2xl border border-guapinol-brown/10 bg-white sm:w-52 lg:w-56 transition duration-300 hover:-translate-y-1 hover:shadow-lg';
    tarjeta.innerHTML = `
      ${foto}
      <div class="flex flex-1 flex-col p-4">
        <p class="text-xs text-stone-500">${linea}</p>
        <h3 class="mt-1 font-semibold text-stone-900">${nombre}</h3>
        <p class="mt-auto pt-3 font-semibold text-stone-900">${formatoColones(precio)}</p>
        <div class="mt-3 grid gap-2">
          <button type="button" class="agregar rounded-lg border border-stone-300 py-2 text-sm hover:border-stone-900">Agregar al carrito</button>
          <button type="button" class="comprar rounded-lg bg-lime-400 py-2 text-sm font-medium text-stone-900 hover:bg-lime-500">Comprar ahora</button>
        </div>
      </div>
    `;

    // al tocar la foto se abre la vista 360° (abrirVista360 está en vista360.js)
    if (tiene360) {
      tarjeta.querySelector('.ver360').addEventListener('click', function () {
        abrirVista360(producto);
      });
    }

    // botón de agregar (agregarAlCarrito está en carrito.js)
    const botonAgregar = tarjeta.querySelector('.agregar');
    botonAgregar.addEventListener('click', function () {
      agregarAlCarrito({
        clave: producto.foto,        // la foto no se repite, sirve de identificador
        nombre: producto.linea,
        color: producto.nombre,
        dije: producto.material,     // el carrito muestra el color y el material
        precio: precio
      });

      // cambia el texto del botón por un momento
      botonAgregar.textContent = '¡Agregado!';
      setTimeout(function () {
        botonAgregar.textContent = 'Agregar al carrito';
      }, 1500);
    });

    // botón de comprar, abre whatsapp con productco
    tarjeta.querySelector('.comprar').addEventListener('click', function () {
      let mensaje = SALUDO + ', quiero comprar:\n';
      mensaje = mensaje + '- ' + producto.linea + ' (' + producto.nombre + ')\n';
      mensaje = mensaje + '- Material: ' + producto.material + '\n';
      mensaje = mensaje + 'Total: ' + formatoColones(precio);
      enviarWhatsApp(mensaje);
    });

    listaCatalogo.appendChild(tarjeta);
  });

  // si no quedó ninguno
  if (visibles === 0) {
    listaCatalogo.innerHTML = '<p class="py-10 text-stone-500">No hay productos con esos filtros.</p>';
  }

  // contador, singular o plural
  if (visibles === 1) {
    contadorCatalogo.textContent = '1 producto';
  } else {
    contadorCatalogo.textContent = visibles + ' productos';
  }
}


// crea los botones de filtro
// alTocar es lo que pasa cuando le dan clic
function dibujarBotones(zona, opciones, elegido, alTocar) {

  zona.innerHTML = '';

  opciones.forEach(function (opcion) {

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = opcion.texto;

    if (opcion.id === elegido) {
      boton.className = 'rounded-full border border-stone-900 bg-stone-900 px-4 py-2 text-sm text-white';
    } else {
      boton.className = 'rounded-full border border-stone-300 px-4 py-2 text-sm hover:border-stone-900';
    }

    boton.addEventListener('click', function () {
      alTocar(opcion.id);
    });

    zona.appendChild(boton);
  });
}

// llena un menú desplegable celular con las mismas opciones de los botones
function llenarSelect(select, opciones) {

  opciones.forEach(function (opcion) {
    const item = document.createElement('option');
    item.value = opcion.id;
    item.textContent = opcion.texto;
    select.appendChild(item);
  });
}

// dibuja los filtros y después los productos
function mostrarTodo() {
  dibujarBotones(zonaCategorias, CATEGORIAS, filtroCategoria, function (id) {
    filtroCategoria = id;
    mostrarTodo();
  });
  dibujarBotones(zonaMateriales, MATERIALES, filtroMaterial, function (id) {
    filtroMaterial = id;
    mostrarTodo();
  });

  // el menú desplegable muestra el mismo filtro que los botones
  selectCategoria.value = filtroCategoria;
  selectMaterial.value = filtroMaterial;

  mostrarCatalogo();
}

// cuando eligen otra opción en el menú desplegable
selectCategoria.addEventListener('change', function () {
  filtroCategoria = selectCategoria.value;
  mostrarTodo();
});

selectMaterial.addEventListener('change', function () {
  filtroMaterial = selectMaterial.value;
  mostrarTodo();
});


// pide los productos al backend y después dibuja todo
async function cargarProductos() {
  listaCatalogo.innerHTML = '<p class="py-10 text-stone-500">Cargando productos...</p>';

  try {
    const respuesta = await fetch(API_URL + '/productos');   // GET /productos
    PRODUCTOS = await respuesta.json();                       // JSON -> arreglo
    mostrarTodo();
  } catch (error) {
    // si el servidor está apagado, fetch falla y se avisa
    listaCatalogo.innerHTML = '<p class="py-10 text-stone-500">No se pudieron cargar los productos. Revisa que el servidor esté encendido.</p>';
    contadorCatalogo.textContent = '';
  }
}


// al cargar la página
llenarSelect(selectCategoria, CATEGORIAS);
llenarSelect(selectMaterial, MATERIALES);
cargarProductos();