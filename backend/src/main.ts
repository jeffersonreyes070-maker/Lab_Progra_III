import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: el backend solo acepta peticiones del navegador que vengan de estas páginas.
  // En la computadora: Live Server (puerto 5500).
  // Publicado: la dirección del sitio va en la variable FRONTEND_URL
  // (si son varias, separadas por coma, por ejemplo la de Render y el dominio propio).
  const paginasPermitidas = ['http://127.0.0.1:5500', 'http://localhost:5500'];
  if (process.env.FRONTEND_URL) {
    const direcciones = process.env.FRONTEND_URL.split(',');
    direcciones.forEach(function (direccion) {
      paginasPermitidas.push(direccion.trim());
    });
  }
  app.enableCors({ origin: paginasPermitidas });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // en la computadora usa el puerto 3000;
  // publicado (Render o Heroku), el puerto lo decide el servicio y viene en la variable PORT
  const puerto = process.env.PORT ?? 3000;
  await app.listen(puerto);

  console.log('API de Artesanías Guapinol corriendo en el puerto ' + puerto);
}
bootstrap();
