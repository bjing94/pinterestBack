import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CommentModel } from './comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(CommentModel)
    private readonly commentModel: ModelType<CommentModel>,
  ) {}

  async findCommentById(id: string) {
    return this.commentModel.findById(id).exec();
  }

  async updateCommentById(id: string, dto: UpdateCommentDto) {
    return this.commentModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async createComment(dto: CreateCommentDto) {
    return this.commentModel.create(dto);
  }

  async deleteCommentById(id: string) {
    return this.commentModel.findByIdAndDelete(id).exec();
  }
}
