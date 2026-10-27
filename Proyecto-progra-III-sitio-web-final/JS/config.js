// config.js: dirección del backend (NestJS)
// la usan catalogo.js y admin.js, por eso se carga antes que ellos

// dirección del backend publicado
// (cambiar por la que da Render o Heroku al crear el servicio,
//  por ejemplo 'https://guapinol-api.onrender.com', sin / al final)
let API_URL = 'https://DIRECCION-DEL-BACKEND';

// si la página se abre en la computadora (Live Server), usa el backend local
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  API_URL = 'http://localhost:3000';
}
