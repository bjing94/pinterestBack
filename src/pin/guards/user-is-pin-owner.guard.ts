import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PIN_PERMISSION_DENIED } from '../constants/pin.constants';
import { PinService } from '../pin.service';

@Injectable()
export class UserIsPinOwnerGuard implements CanActivate {
  constructor(private readonly pinService: PinService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const pinId = request.params['id'];
    const userId = request.user['_id'];

    const pin = await this.pinService.findPinById(pinId);
    if (!pin || userId !== pin.userId) {
      throw new ForbiddenException(PIN_PERMISSION_DENIED);
    }

    return true;
  }
}
