import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  // TypeOrmModule: registra la tabla de productos para usar su repositorio en el servicio
  // AuthModule: el guard lo necesita para revisar los tokens
  imports: [TypeOrmModule.forFeature([Producto]), AuthModule],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
