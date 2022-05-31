import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BOARD_PERMISSION_DENIED } from '../board.constants';
import { BoardService } from '../board.service';

@Injectable()
export class UserIsBoardOwnerGuard implements CanActivate {
  constructor(private readonly boardService: BoardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const boardId = request.params['id'];
    const userId = request.user['_id'];

    const board = await this.boardService.findBoardById(boardId);
    if (!board || userId !== board.userId) {
      throw new ForbiddenException(BOARD_PERMISSION_DENIED);
    }

    return true;
  }
}
