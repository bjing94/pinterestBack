import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  displayId: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
