import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Modelo de un producto del catálogo.
// @Entity convierte esta clase en la tabla "productos" de PostgreSQL
// y cada @Column es una columna de esa tabla.
@Entity('productos')
export class Producto {
  // el id lo genera la base de datos (1, 2, 3...)
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  linea!: string;

  @Column()
  categoria!: string;

  @Column()
  material!: string;

  @Column('int')
  precio!: number;

  // nombre de la foto del sitio (ej. pulsera-roja-iman.jpg)
  // o dirección completa de Cloudinary si se subió desde el panel
  @Column()
  foto!: string;

  @Column({ default: true })
  disponible!: boolean;
}
