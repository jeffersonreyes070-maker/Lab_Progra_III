// admin.js: inicio de sesión y administración de productos (agregar, editar, eliminar)

// el token se guarda en el navegador para no pedir la contraseña cada vez
let token = localStorage.getItem('token-admin');


// elementos del html
const seccionLogin = document.querySelector('#seccion-login');
const seccionPanel = document.querySelector('#seccion-panel');
const formLogin = document.querySelector('#form-login');
const inputUsuario = document.querySelector('#usuario');
const inputPassword = document.querySelector('#password');
const errorLogin = document.querySelector('#error-login');
const botonSalir = document.querySelector('#boton-salir');

const tablaProductos = document.querySelector('#tabla-productos');
const mensajePanel = document.querySelector('#mensaje-panel');
const botonNuevo = document.querySelector('#boton-nuevo');

const ventana = document.querySelector('#ventana-producto');
const ventanaFondo = document.querySelector('#ventana-fondo');
const botonCerrar = document.querySelector('#boton-cerrar');
const botonCancelar = document.querySelector('#boton-cancelar');
const tituloVentana = document.querySelector('#titulo-ventana');
const formProducto = document.querySelector('#form-producto');
const errorProducto = document.querySelector('#error-producto');

const inputId = document.querySelector('#producto-id');
const inputNombre = document.querySelector('#p-nombre');
const inputLinea = document.querySelector('#p-linea');
const selectCategoria = document.querySelector('#p-categoria');
const selectMaterial = document.querySelector('#p-material');
const inputPrecio = document.querySelector('#p-precio');
const inputDisponible = document.querySelector('#p-disponible');
const inputArchivo = document.querySelector('#p-archivo');
const inputFoto = document.querySelector('#p-foto');
const vistaFoto = document.querySelector('#p-vista-foto');
const estadoFoto = document.querySelector('#estado-foto');


// ===== INICIO DE SESIÓN =====

function mostrarLogin() {
  seccionLogin.classList.remove('hidden');
  seccionPanel.classList.add('hidden');
  botonSalir.classList.add('hidden');
}

function mostrarPanel() {
  seccionLogin.classList.add('hidden');
  seccionPanel.classList.remove('hidden');
  botonSalir.classList.remove('hidden');
  cargarProductos();
}

// POST /auth/login: si el usuario y la contraseña están bien, el servidor devuelve el token
formLogin.addEventListener('submit', async function (event) {
  event.preventDefault();   // evita que la página se recargue
  errorLogin.textContent = '';

  const datos = {
    usuario: inputUsuario.value.trim(),
    password: inputPassword.value
  };

  if (datos.usuario === '' || datos.password === '') {
    errorLogin.textContent = 'Escribe el usuario y la contraseña.';
    return;
  }

  try {
    const respuesta = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    // 429: demasiados intentos fallidos, el servidor explica cuánto esperar
    if (respuesta.status === 429) {
      const error = await respuesta.json();
      errorLogin.textContent = error.message;
      return;
    }

    if (!respuesta.ok) {
      errorLogin.textContent = 'Usuario o contraseña incorrectos.';
      return;
    }

    const resultado = await respuesta.json();
    token = resultado.token;
    localStorage.setItem('token-admin', token);
    inputPassword.value = '';
    mostrarPanel();
  } catch (error) {
    errorLogin.textContent = 'No se pudo conectar con el servidor.';
  }
});

// cerrar sesión: se avisa al servidor para que el token deje de servir y se borra del navegador
botonSalir.addEventListener('click', function () {
  fetch(API_URL + '/auth/logout', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  localStorage.removeItem('token-admin');
  token = null;
  mostrarLogin();
});

// si el servidor responde 401 el token ya no sirve (venció o el servidor se reinició):
// se borra y se vuelve a pedir la contraseña
function sesionVencida() {
  localStorage.removeItem('token-admin');
  token = null;
  mostrarLogin();
  errorLogin.textContent = 'La sesión venció. Inicia sesión de nuevo.';
}


// ===== LISTA DE PRODUCTOS =====

// las fotos subidas ya son una dirección completa (Cloudinary),
// las originales están en la carpeta del sitio
function rutaFoto(foto) {
  if (foto.indexOf('http') === 0) {
    return foto;
  }
  return 'assets/images/catalogo/' + foto;
}

// GET /productos: dibuja una fila por cada producto
async function cargarProductos() {
  mensajePanel.textContent = '';

  try {
    const respuesta = await fetch(API_URL + '/productos');
    const productos = await respuesta.json();

    tablaProductos.innerHTML = '';

    productos.forEach(function (producto) {
      let disponible = 'Sí';
      if (producto.disponible === false) {
        disponible = 'No';
      }

      // los datos se pasan por textoSeguro (pedidos.js) antes de ponerlos en el HTML
      const fila = document.createElement('tr');
      fila.className = 'border-t border-stone-100';
      fila.innerHTML = `
        <td class="px-4 py-3">${producto.id}</td>
        <td class="px-4 py-3">
          <img src="${textoSeguro(rutaFoto(producto.foto))}" alt="${textoSeguro(producto.nombre)}" class="h-12 w-12 object-contain rounded-lg border border-stone-100">
        </td>
        <td class="px-4 py-3">${textoSeguro(producto.nombre)}</td>
        <td class="px-4 py-3">${textoSeguro(producto.categoria)}</td>
        <td class="px-4 py-3">${textoSeguro(producto.material)}</td>
        <td class="px-4 py-3">${formatoColones(producto.precio)}</td>
        <td class="px-4 py-3">${disponible}</td>
        <td class="px-4 py-3 text-right whitespace-nowrap">
          <button type="button" class="editar text-sm text-blue-700 hover:underline">Editar</button>
          <button type="button" class="eliminar ml-2 text-sm text-red-700 hover:underline">Eliminar</button>
        </td>
      `;

      fila.querySelector('.editar').addEventListener('click', function () {
        abrirVentana(producto);
      });
      fila.querySelector('.eliminar').addEventListener('click', function () {
        eliminarProducto(producto);
      });

      tablaProductos.appendChild(fila);
    });
  } catch (error) {
    mensajePanel.textContent = 'No se pudieron cargar los productos. Revisa que el servidor esté encendido.';
  }
}


// ===== VENTANA PARA AGREGAR O EDITAR =====

// si recibe un producto, la abre para editarlo; si recibe null, para uno nuevo
function abrirVentana(producto) {
  errorProducto.textContent = '';
  inputArchivo.value = '';
  estadoFoto.textContent = 'JPG, PNG o WEBP, máximo 5 MB';

  if (producto === null) {
    tituloVentana.textContent = 'Nuevo producto';
    inputId.value = '';
    inputNombre.value = '';
    inputLinea.value = '';
    selectCategoria.value = 'pulseras';
    selectMaterial.value = 'Macramé';
    inputPrecio.value = '';
    inputDisponible.checked = true;
    inputFoto.value = '';
    vistaFoto.classList.add('hidden');
  } else {
    tituloVentana.textContent = 'Editar producto';
    inputId.value = producto.id;
    inputNombre.value = producto.nombre;
    inputLinea.value = producto.linea;
    selectCategoria.value = producto.categoria;
    selectMaterial.value = producto.material;
    inputPrecio.value = producto.precio;
    inputDisponible.checked = producto.disponible;
    inputFoto.value = producto.foto;
    vistaFoto.src = rutaFoto(producto.foto);
    vistaFoto.classList.remove('hidden');
  }

  ventana.classList.remove('hidden');
}

function cerrarVentana() {
  ventana.classList.add('hidden');
}

botonNuevo.addEventListener('click', function () {
  abrirVentana(null);
});
botonCerrar.addEventListener('click', cerrarVentana);
botonCancelar.addEventListener('click', cerrarVentana);
ventanaFondo.addEventListener('click', cerrarVentana);   // clic en lo oscuro


// POST /upload: al elegir una foto se sube al servidor y se guarda el nombre que devuelve
inputArchivo.addEventListener('change', async function () {
  const archivo = inputArchivo.files[0];
  if (!archivo) {
    return;
  }

  // la foto viaja como formulario (FormData), no como JSON
  const formulario = new FormData();
  formulario.append('foto', archivo);
  estadoFoto.textContent = 'Subiendo imagen...';

  try {
    const respuesta = await fetch(API_URL + '/upload', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formulario
    });

    if (respuesta.status === 401) {
      cerrarVentana();
      sesionVencida();
      return;
    }

    if (!respuesta.ok) {
      estadoFoto.textContent = 'No se pudo subir la imagen (solo JPG, PNG o WEBP de máximo 5 MB).';
      return;
    }

    const resultado = await respuesta.json();
    inputFoto.value = resultado.foto;
    vistaFoto.src = rutaFoto(resultado.foto);
    vistaFoto.classList.remove('hidden');
    estadoFoto.textContent = 'Imagen subida correctamente.';
  } catch (error) {
    estadoFoto.textContent = 'No se pudo conectar con el servidor.';
  }
});


// guardar: si no hay id es POST (nuevo), si hay id es PATCH (editar)
formProducto.addEventListener('submit', async function (event) {
  event.preventDefault();
  errorProducto.textContent = '';

  const datos = {
    nombre: inputNombre.value.trim(),
    linea: inputLinea.value.trim(),
    categoria: selectCategoria.value,
    material: selectMaterial.value,
    precio: Number(inputPrecio.value),   // .value es texto, el servidor espera número
    foto: inputFoto.value,
    disponible: inputDisponible.checked
  };

  if (datos.nombre === '' || datos.linea === '' || datos.foto === '' || datos.precio <= 0) {
    errorProducto.textContent = 'Completa nombre, línea, precio y foto.';
    return;
  }

  let url = API_URL + '/productos';
  let metodo = 'POST';
  if (inputId.value !== '') {
    url = API_URL + '/productos/' + inputId.value;
    metodo = 'PATCH';
  }

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(datos)
    });

    if (respuesta.status === 401) {
      cerrarVentana();
      sesionVencida();
      return;
    }

    if (!respuesta.ok) {
      // el servidor explica qué falló (puede ser un texto o una lista de textos)
      const error = await respuesta.json();
      if (Array.isArray(error.message)) {
        errorProducto.textContent = error.message.join('. ');
      } else {
        errorProducto.textContent = error.message;
      }
      return;
    }

    cerrarVentana();
    cargarProductos();
  } catch (error) {
    errorProducto.textContent = 'No se pudo conectar con el servidor.';
  }
});


// DELETE /productos/:id
async function eliminarProducto(producto) {
  if (!confirm('¿Eliminar "' + producto.nombre + '"?')) {
    return;
  }

  try {
    const respuesta = await fetch(API_URL + '/productos/' + producto.id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (respuesta.status === 401) {
      sesionVencida();
      return;
    }

    if (!respuesta.ok) {
      mensajePanel.textContent = 'No se pudo eliminar el producto.';
      return;
    }

    cargarProductos();
  } catch (error) {
    mensajePanel.textContent = 'No se pudo conectar con el servidor.';
  }
}


// al cargar la página: si ya había iniciado sesión, va directo al panel
if (token) {
  mostrarPanel();
} else {
  mostrarLogin();
}
