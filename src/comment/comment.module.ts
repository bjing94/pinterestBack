import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CommentModel } from './comment.model';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CommentModel,
        schemaOptions: {
          collection: 'Comment',
        },
      },
    ]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
