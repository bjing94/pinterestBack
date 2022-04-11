import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FindPinDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  random?: boolean;
}
