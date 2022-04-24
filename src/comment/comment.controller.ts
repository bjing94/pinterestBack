import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    const comment = await this.commentService.findCommentById(id);
    if (!comment) {
      return new NotFoundException('Comment not found.');
    }
    return comment;
  }

  @Post('create')
  async create(@Body() dto: CreateCommentDto) {
    return this.commentService.createComment(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentService.updateCommentById(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.commentService.deleteCommentById(id);
  }
}
