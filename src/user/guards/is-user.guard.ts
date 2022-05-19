import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { USER_NO_PERMISSION } from '../user.constants';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredId = request.params['id'];
    const actualId = request.user['_id'];

    if (requiredId !== actualId) {
      throw new ForbiddenException(USER_NO_PERMISSION);
    }
    return requiredId === actualId;
  }
}
