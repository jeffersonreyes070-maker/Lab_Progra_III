import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LoginDto } from './login.dto';

// Datos del administrador.
// En la computadora se usan los valores de la derecha.
// Publicado (Render) se usan las variables de entorno ADMIN_USUARIO y ADMIN_PASSWORD,
// que se configuran en el servicio y no quedan escritas en GitHub.
const USUARIO_ADMIN = process.env.ADMIN_USUARIO ?? 'admin';
const PASSWORD_ADMIN = process.env.ADMIN_PASSWORD ?? 'guapinol123';

// Cuánto dura una sesión: 2 horas (en milisegundos)
const DURACION_SESION = 2 * 60 * 60 * 1000;

// Límite de intentos: después de 5 contraseñas incorrectas se bloquea el login 10 minutos
const MAXIMO_INTENTOS = 5;
const TIEMPO_BLOQUEO = 10 * 60 * 1000;

@Injectable()
export class AuthService {
  // Tokens que están activos y la hora en que vence cada uno.
  // Se guardan en memoria: si el servidor se reinicia, hay que iniciar sesión otra vez.
  private tokensActivos = new Map<string, number>();

  // Intentos fallidos seguidos y hasta qué hora está bloqueado el login
  private intentosFallidos = 0;
  private bloqueadoHasta = 0;

  login(datos: LoginDto) {
    // Si está bloqueado, devolver error 429 (demasiadas peticiones)
    if (Date.now() < this.bloqueadoHasta) {
      const minutos = Math.ceil((this.bloqueadoHasta - Date.now()) / 60000);
      throw new HttpException(
        'Demasiados intentos fallidos. Intenta de nuevo en ' + minutos + ' minuto(s).',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Si el usuario o la contraseña no coinciden, se cuenta el intento y se devuelve error 401
    if (datos.usuario !== USUARIO_ADMIN || datos.password !== PASSWORD_ADMIN) {
      this.intentosFallidos = this.intentosFallidos + 1;

      if (this.intentosFallidos >= MAXIMO_INTENTOS) {
        this.bloqueadoHasta = Date.now() + TIEMPO_BLOQUEO;
        this.intentosFallidos = 0;
      }

      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Si entró bien, se reinicia el contador
    this.intentosFallidos = 0;

    // Cada inicio de sesión recibe un token nuevo, generado al azar
    const token = randomUUID();
    this.tokensActivos.set(token, Date.now() + DURACION_SESION);

    return { token: token };
  }

  // Revisa si un token existe y todavía no ha vencido (lo usa el guard)
  tokenValido(token: string): boolean {
    const vence = this.tokensActivos.get(token);

    if (vence === undefined) {
      return false;
    }

    // Si ya pasó la hora de vencimiento, se borra
    if (Date.now() > vence) {
      this.tokensActivos.delete(token);
      return false;
    }

    return true;
  }

  // Al cerrar sesión el token se borra y ya no sirve
  logout(token: string) {
    this.tokensActivos.delete(token);
    return { mensaje: 'Sesión cerrada' };
  }
}
