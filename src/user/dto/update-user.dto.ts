import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  displayId?: string;

  @IsOptional()
  @IsString()
  avatarSrc?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  newPassword?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  createdPins?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  savedPins?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  boards?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subscribers?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subscriptions?: string[];
}
