import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePinDto {
  @IsString()
  title: string;

  @IsString()
  username: string;

  @IsString()
  userId: string;

  @IsString()
  boardId: string;

  @IsString()
  imgId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  comments?: string[];
}
