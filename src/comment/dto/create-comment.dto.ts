import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  userId: string;

  @IsString()
  content: string;
}
