import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import {
  COMMENT_DELETED,
  COMMENT_NOT_CREATED,
  COMMENT_NOT_FOUND,
  COMMENT_PERMISSION_DENIED,
  COMMENT_UPDATED,
} from './comment.constants';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserIsCommentOwnerGuard } from './guards/user-is-comment-owner.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @HttpCode(200)
  @Get(':id')
  async getComment(@Param('id', MongoIdValidationPipe) _id: string) {
    const comment = await this.commentService.findCommentById(_id);
    if (!comment) {
      throw new BadRequestException(COMMENT_NOT_FOUND);
    }
    console.log('Returning comment requested:', comment);
    return comment;
  }

  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async createComment(@Body() dto: CreateCommentDto) {
    const comment = await this.commentService.createComment(dto);
    if (!comment) {
      throw new BadRequestException(COMMENT_NOT_CREATED);
    }
    return comment;
  }

  @UseGuards(UserIsCommentOwnerGuard)
  @HttpCode(200)
  @Delete(':id')
  async deleteComment(@Param('id', MongoIdValidationPipe) _id: string) {
    const comment = await this.commentService.findCommentById(_id);
    if (!comment) {
      throw new BadRequestException(COMMENT_NOT_FOUND);
    }
    await this.commentService.deleteCommentById(_id);

    return {
      msg: COMMENT_DELETED,
    };
  }

  @HttpCode(200)
  @Patch(':id')
  async updateComment(
    @Param('id', MongoIdValidationPipe) _id: string,
    @Body() dto: UpdateCommentDto,
    @Req() req: Express.Request,
  ) {
    if (Object.keys(dto).length === 1 && dto.likedBy !== undefined) {
      const comment = await this.commentService.updateCommentById(_id, dto);
      if (!comment) {
        throw new BadRequestException(COMMENT_NOT_FOUND);
      }
      return comment;
    }
    if (Object.keys(dto).length === 1 && dto.usefulBy !== undefined) {
      const comment = await this.commentService.updateCommentById(_id, dto);
      if (!comment) {
        throw new BadRequestException(COMMENT_NOT_FOUND);
      }
      return comment;
    }
    // check if he is the owner
    const userId = req.user['_id'];

    const comment = await this.commentService.findCommentById(_id);
    if (!comment || userId !== comment.userId) {
      throw new ForbiddenException(COMMENT_PERMISSION_DENIED);
    }

    const updatedComment = await this.commentService.updateCommentById(
      _id,
      dto,
    );
    if (!updatedComment) {
      throw new BadRequestException(COMMENT_NOT_FOUND);
    }

    return {
      msg: COMMENT_UPDATED,
    };
  }
}
