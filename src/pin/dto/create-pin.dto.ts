import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CommentDto {
  @IsString()
  username: string;

  @IsString()
  content: string;

  @IsNumber()
  likes: number;
}

export class CreatePinDto {
  @IsString()
  title: string;

  @IsString()
  username: string;

  @IsString()
  userId: string;

  @IsString()
  imgId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CommentDto)
  comments?: CommentDto[];
}
