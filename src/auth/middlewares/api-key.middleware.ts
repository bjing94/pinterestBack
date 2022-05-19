import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';

import { AUTH_NO_KEY, AUTH_WRONG_KEY } from '../auth.constants';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const userKey = req.headers['api-key'];
    if (!userKey) {
      throw new ForbiddenException(AUTH_NO_KEY);
    }
    if (userKey !== process.env.API_KEY) {
      throw new ForbiddenException(AUTH_WRONG_KEY);
    }
    next();
  }
}
