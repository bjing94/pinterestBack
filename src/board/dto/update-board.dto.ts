import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  pins?: string[];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  userId?: string; // user mongo id like really big one dsgfdg323dfdsfda254gf
}
