import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

// Un guard decide si una petición puede pasar o no.
// Este solo deja pasar si la petición trae un token válido:
//   Authorization: Bearer (token que dio el login)
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const peticion = context.switchToHttp().getRequest();
    const authorization = peticion.headers['authorization'] ?? '';

    // Se quita "Bearer " para quedarse solo con el token
    const token = authorization.replace('Bearer ', '');

    if (this.authService.tokenValido(token)) {
      return true;
    }

    // Si no trae token, o es falso, o ya venció: error 401
    throw new UnauthorizedException('Debe iniciar sesión como administrador');
  }
}
