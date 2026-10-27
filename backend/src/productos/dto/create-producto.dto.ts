import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductoDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(80, { message: 'El nombre no puede pasar de 80 caracteres' })
  nombre!: string;

  @IsString({ message: 'La línea debe ser texto' })
  @IsNotEmpty({ message: 'La línea es obligatoria' })
  @MaxLength(60, { message: 'La línea no puede pasar de 60 caracteres' })
  linea!: string;

  @IsIn(['pulseras', 'collares', 'llaveros'], {
    message: 'La categoría debe ser: pulseras, collares o llaveros',
  })
  categoria!: string;

  @IsIn(['Semillas', 'Madera', 'Macramé', 'Cuentas'], {
    message: 'El material debe ser: Semillas, Madera, Macramé o Cuentas',
  })
  material!: string;

  @IsInt({ message: 'El precio debe ser un número entero (colones)' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio!: number;

  // nombre de una foto del sitio (ej. pulsera-roja-iman.jpg)
  // o dirección de Cloudinary si se subió desde el panel
  @IsString({ message: 'La foto debe ser texto' })
  @IsNotEmpty({ message: 'La foto es obligatoria' })
  @MaxLength(300, { message: 'La foto no puede pasar de 300 caracteres' })
  foto!: string;

  @IsOptional()
  @IsBoolean({ message: 'disponible debe ser true o false' })
  disponible?: boolean;
}
