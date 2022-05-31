import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString({ each: true })
  @IsOptional()
  likedBy?: string[];

  @IsString({ each: true })
  @IsOptional()
  usefulBy?: string[];
}
