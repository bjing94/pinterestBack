import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_NOT_AUTHORIZED } from '../auth.constants';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isAuth = request.isAuthenticated();
    if (!isAuth) {
      throw new UnauthorizedException(AUTH_NOT_AUTHORIZED);
    }

    return isAuth;
  }
}
