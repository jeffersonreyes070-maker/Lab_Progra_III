import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =====================================
  // POST /auth/login - INICIAR SESIÓN
  // =====================================

  @Post('login')
  @HttpCode(200) // responde 200 (no 201) porque no se crea nada
  login(@Body() datos: LoginDto) {
    return this.authService.login(datos);
  }

  // =====================================
  // POST /auth/logout - CERRAR SESIÓN
  // =====================================

  @Post('logout')
  @HttpCode(200)
  logout(@Headers('authorization') authorization: string) {
    const token = (authorization ?? '').replace('Bearer ', '');
    return this.authService.logout(token);
  }
}
