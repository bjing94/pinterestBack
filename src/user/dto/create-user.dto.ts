import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
