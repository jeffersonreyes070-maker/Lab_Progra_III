// contacto.js: formulario de contacto y año del footer

// elementos del html
const formularioContacto = document.querySelector('#form-contacto');

const inputNombre = document.querySelector('#nombre');
const inputTelefono = document.querySelector('#telefono');
const inputCorreo = document.querySelector('#correo');
const selectMotivo = document.querySelector('#motivo');
const inputMensaje = document.querySelector('#mensaje');

// aquí salen los errores
const errorNombre = document.querySelector('#error-nombre');
const errorTelefono = document.querySelector('#error-telefono');
const errorCorreo = document.querySelector('#error-correo');
const errorMotivo = document.querySelector('#error-motivo');
const errorMensaje = document.querySelector('#error-mensaje');

const estadoFormulario = document.querySelector('#form-estado');


// pone el mensaje de error y el borde rojo
function mostrarError(campo, parrafo, texto) {
  parrafo.textContent = texto;
  campo.classList.remove('border-stone-300');
  campo.classList.add('border-red-500');
}

// quita el error y deja el borde normal
function quitarError(campo, parrafo) {
  parrafo.textContent = '';
  campo.classList.remove('border-red-500');
  campo.classList.add('border-stone-300');
}

// al enviar se revisa todo y si está bien abre whatsapp
formularioContacto.addEventListener('submit', function (event) {

  event.preventDefault();   // para que no recargue la página

  // trim quita los espacios de los lados
  const nombre = inputNombre.value.trim();
  const telefono = inputTelefono.value.trim();
  const correo = inputCorreo.value.trim();
  const motivo = selectMotivo.value;
  const mensaje = inputMensaje.value.trim();

  // borra los errores de antes
  quitarError(inputNombre, errorNombre);
  quitarError(inputTelefono, errorTelefono);
  quitarError(inputCorreo, errorCorreo);
  quitarError(selectMotivo, errorMotivo);
  quitarError(inputMensaje, errorMensaje);
  estadoFormulario.textContent = '';

  // si algo está mal esto pasa a true
  let hayErrores = false;

  if (nombre.length < 3) {
    mostrarError(inputNombre, errorNombre, 'Escribe tu nombre (mínimo 3 letras).');
    hayErrores = true;
  }

  // teléfono: tienen que ser 8 números (sin espacios ni guiones)
  const soloNumeros = telefono.replaceAll(' ', '').replaceAll('-', '');
  if (/^[0-9]{8}$/.test(soloNumeros) === false) {
    mostrarError(inputTelefono, errorTelefono, 'Escribe un número de 8 dígitos, por ejemplo 8888 8888.');
    hayErrores = true;
  }

  // el correo es opcional, pero si lo ponen debe tener @ y punto
  if (correo !== '' && (!correo.includes('@') || !correo.includes('.'))) {
    mostrarError(inputCorreo, errorCorreo, 'Revisa el correo, por ejemplo nombre@correo.com.');
    hayErrores = true;
  }

  if (motivo === '') {
    mostrarError(selectMotivo, errorMotivo, 'Elige el motivo de tu mensaje.');
    hayErrores = true;
  }

  if (mensaje.length < 10) {
    mostrarError(inputMensaje, errorMensaje, 'Cuéntanos un poco más (mínimo 10 caracteres).');
    hayErrores = true;
  }

  // si hubo errores no se manda nada
  if (hayErrores) {
    return;
  }

  // armar el mensaje
  let texto = SALUDO + '\n';
  texto = texto + 'Motivo: ' + motivo + '\n';
  texto = texto + 'Nombre: ' + nombre + '\n';
  texto = texto + 'Teléfono: ' + telefono + '\n';
  if (correo !== '') {
    texto = texto + 'Correo: ' + correo + '\n';
  }
  texto = texto + '\n' + mensaje;

  enviarWhatsApp(texto);   // está en pedidos.js

  // limpiar el formulario y avisar
  formularioContacto.reset();
  estadoFormulario.textContent = 'Se abrió WhatsApp con tu mensaje. Solo falta tocar Enviar.';
});


// año del footer
document.querySelector('#anio').textContent = new Date().getFullYear();
