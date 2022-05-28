import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { COMMENT_PERMISSION_DENIED } from '../comment.constants';
import { CommentService } from '../comment.service';

@Injectable()
export class UserIsCommentOwnerGuard implements CanActivate {
  constructor(private readonly commentService: CommentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const commentId = request.params['id'];
    const userId = request.user['_id'];

    const comment = await this.commentService.findCommentById(commentId);
    if (!comment || userId !== comment.userId) {
      throw new ForbiddenException(COMMENT_PERMISSION_DENIED);
    }

    return true;
  }
}
