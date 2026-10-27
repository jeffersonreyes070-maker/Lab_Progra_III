import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { PRODUCTOS_INICIALES } from './data/productos.seed';

@Injectable()
export class ProductosService implements OnModuleInit {
  // El repositorio es el que habla con la tabla "productos" de la base de datos.
  // Reemplaza al arreglo que se usaba antes.
  constructor(
    @InjectRepository(Producto)
    private readonly repositorio: Repository<Producto>,
  ) {}

  // ======================================
  // AL ARRANCAR EL SERVIDOR
  // ======================================

  // Si la tabla está vacía (primera vez), se llena con los 16 productos iniciales
  async onModuleInit() {
    const cantidad = await this.repositorio.count();
    if (cantidad === 0) {
      await this.repositorio.save(PRODUCTOS_INICIALES);
    }
  }

  // ======================================
  // GET - CONSULTAR PRODUCTOS
  // ======================================

  findAll() {
    return this.repositorio.find({ order: { id: 'ASC' } });
  }

  // ======================================
  // GET - CONSULTAR UN PRODUCTO POR ID
  // ======================================

  async findOne(id: number) {
    const producto = await this.repositorio.findOneBy({ id: id });

    // Si no existe, devolver error 404
    if (!producto) {
      throw new NotFoundException(`No existe un producto con id ${id}`);
    }

    return producto;
  }

  // ======================================
  // POST - AGREGAR PRODUCTOS
  // ======================================

  async create(datos: CreateProductoDto) {
    // Si la foto ya existe, devolver error 409
    const repetido = await this.repositorio.findOneBy({ foto: datos.foto });
    if (repetido) {
      throw new ConflictException(
        `Ya existe un producto con la foto "${datos.foto}"`,
      );
    }

    // si no mandan "disponible", queda en true
    if (datos.disponible === undefined) {
      datos.disponible = true;
    }

    // save guarda en la base de datos y devuelve el producto con su id nuevo
    return this.repositorio.save(datos);
  }

  // ======================================
  // PATCH - MODIFICAR PRODUCTOS
  // ======================================

  async update(id: number, datos: UpdateProductoDto) {
    const producto = await this.findOne(id);

    // Si no se envía ningún campo, devolver error 400
    if (Object.keys(datos).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar el producto');
    }

    // Si la foto ya la tiene otro producto, devolver error 409
    if (datos.foto) {
      const otro = await this.repositorio.findOneBy({ foto: datos.foto });
      if (otro && otro.id !== id) {
        throw new ConflictException(
          `Ya existe un producto con la foto "${datos.foto}"`,
        );
      }
    }

    // Cambiar solamente las propiedades recibidas y guardar
    Object.assign(producto, datos);
    return this.repositorio.save(producto);
  }

  // ======================================
  // DELETE - ELIMINAR PRODUCTOS
  // ======================================

  async remove(id: number) {
    const producto = await this.findOne(id);   // 404 si no existe

    await this.repositorio.delete(id);

    return {
      mensaje: `Producto ${id} eliminado correctamente`,
      producto: producto,
    };
  }
}
