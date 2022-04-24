import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  username: string;

  @IsString()
  description: string;

  @IsString()
  displayId: string;

  @IsString()
  email: string;

  @IsString()
  passwordHash: string;

  @IsArray()
  @IsString({ each: true })
  createdPins: string[];

  @IsArray()
  @IsString({ each: true })
  savedPins: string[];

  @IsArray()
  @IsString({ each: true })
  boards: string[];

  @IsArray()
  @IsString({ each: true })
  subscribers: string[];

  @IsArray()
  @IsString({ each: true })
  subscriptions: string[];
}
