# Backend Artesanías Guapinol

Backend de nuestro proyecto de Programación III, hecho con NestJS y TypeScript. Guarda los productos en una base de datos PostgreSQL, le da los productos al sitio web y permite al administrador agregarlos, editarlos y eliminarlos.

## Qué se necesita

- Node.js
- Una base de datos PostgreSQL. Usamos **Neon** (gratis): se crea un proyecto y se copia su *connection string*.
- Una cuenta de **Cloudinary** (gratis) para guardar las fotos que se suben desde el panel.

## Cómo instalarlo y ejecutarlo

Dentro de la carpeta `backend`:

1. Copiar el archivo `.env.example` con el nombre `.env` y llenar los valores (base de datos, Cloudinary y administrador).
2. Instalar y arrancar:

```
npm install
npm run start:dev
```

El servidor queda corriendo en http://localhost:3000

La primera vez que arranca, crea la tabla `productos` y la llena con los 16 productos iniciales. Las siguientes veces usa lo que ya está guardado.

Si en Windows PowerShell no deja correr `npm`, se puede usar `npm.cmd run start:dev` o abrir la terminal CMD.

Después se abre el sitio (`Proyecto-progra-III-sitio-web-final/index.html`) con Live Server.

## Recurso: productos

Son las pulseras, collares y llaveros que vende la tienda. Cada producto tiene:

- id
- nombre
- linea
- categoria (pulseras, collares o llaveros)
- material (Semillas, Madera, Macramé o Cuentas)
- precio
- foto
- disponible

## Administrador

El panel está en `admin.html` (enlace "Admin" en el menú del sitio). El usuario y la contraseña son los que se pongan en `.env` (`ADMIN_USUARIO` y `ADMIN_PASSWORD`).

Al iniciar sesión el servidor genera un token al azar, distinto cada vez, que dura 2 horas. Las peticiones que modifican datos tienen que enviarlo en el header:

```
Authorization: Bearer (el token)
```

Al cerrar sesión el token deja de servir. Los tokens se guardan en la memoria del servidor, así que si el servidor se reinicia hay que volver a iniciar sesión.

## Endpoints

- GET /productos --> muestra todos los productos
- GET /productos/:id --> muestra un producto
- POST /productos --> agrega un producto (necesita token)
- PATCH /productos/:id --> modifica un producto (necesita token)
- DELETE /productos/:id --> elimina un producto (necesita token)
- POST /auth/login --> inicia sesión y devuelve el token
- POST /auth/logout --> cierra la sesión (el token deja de servir)
- POST /upload --> sube una foto a Cloudinary y devuelve su dirección (necesita token)

Ejemplo para el POST:

```json
{
  "nombre": "Pulsera de guapinol natural",
  "linea": "Pulsera de semillas",
  "categoria": "pulseras",
  "material": "Semillas",
  "precio": 4500,
  "foto": "pulsera-semilla-guapinol.jpg"
}
```

Si se mandan datos incorrectos responde 400, si falta el token o la contraseña está mal responde 401, si el id no existe responde 404 y si la foto ya la tiene otro producto responde 409.

## Al publicarlo (Render)

- Comando para compilar: `npm install && npm run build`
- Comando para iniciar: `npm start`
- Las mismas variables del archivo `.env` se ponen en "Environment Variables" del servicio
- En el sitio, la dirección del backend publicado va en `JS/config.js`

## Pruebas

Las pruebas están en el archivo Artesanias-Guapinol.postman_collection.json, que se puede importar en Postman. La primera petición inicia sesión y guarda el token para las demás.
