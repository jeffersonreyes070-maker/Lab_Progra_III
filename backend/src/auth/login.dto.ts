import { IsNotEmpty, IsString } from 'class-validator';

// Datos que se reciben para iniciar sesión
export class LoginDto {
  @IsString({ message: 'El usuario debe ser texto' })
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  usuario!: string;

  @IsString({ message: 'La contraseña debe ser texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password!: string;
}
