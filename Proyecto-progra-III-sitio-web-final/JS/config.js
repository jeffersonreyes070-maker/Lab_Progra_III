// config.js: dirección del backend (NestJS)
// catalogo.js y admin.js usan esta variable para peticiones al backend

// dirección del backend publicado
let API_URL = 'https://guapinol-api.onrender.com';

// si la página se abre en la computadora (Live Server), usa el backend local
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  API_URL = 'http://localhost:3000';
}
