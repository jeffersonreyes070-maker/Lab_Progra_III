import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    // lee el archivo .env (en la computadora) y deja sus valores en process.env.
    // Va primero para que DATABASE_URL ya exista cuando se conecte la base de datos.
    ConfigModule.forRoot(),

    // conexión con la base de datos PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,   // dirección completa que da Neon
      ssl: true,                       // Neon exige conexión segura
      autoLoadEntities: true,          // usa las entidades registradas en cada módulo
      // crear o cambiar la tabla a partir de la entidad.
      // Solo se activa con DB_SYNCHRONIZE=true (por ejemplo la primera vez o si cambia la entidad);
      // apagado, un cambio en el código nunca puede borrar columnas con datos.
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),

    ProductosModule,
    AuthModule,
    UploadModule,
  ],
})
export class AppModule {}
