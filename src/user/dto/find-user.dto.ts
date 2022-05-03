import { IsArray, IsOptional, IsString } from 'class-validator';

export class FindUserDto {
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
  email?: string;

  @IsOptional()
  @IsString()
  passwordHash?: string;

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
