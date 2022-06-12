import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePinDto {
  @IsString()
  title: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  boardId?: string;

  @IsString()
  imgId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  comments?: string[];
}
