import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePinDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  boardId?: string;

  @IsOptional()
  @IsString()
  imgId?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  comments?: string[];
}
