import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // =====================================
  // GET - CONSULTAR
  // =====================================

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  // =====================================
  // GET - CONSULTAR UNO POR ID
  // =====================================

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // =====================================
  // POST - CREAR (solo administrador)
  // =====================================

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() datos: CreateProductoDto) {
    return this.productosService.create(datos);
  }

  // =====================================
  // PATCH - ACTUALIZAR (solo administrador)
  // =====================================

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateProductoDto,
  ) {
    return this.productosService.update(id, datos);
  }

  // =====================================
  // DELETE - ELIMINAR (solo administrador)
  // =====================================

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
