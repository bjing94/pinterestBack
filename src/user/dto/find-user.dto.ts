import { IsOptional, IsString } from 'class-validator';

export class FindUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  displayId?: string;
}
