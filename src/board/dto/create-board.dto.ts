import { IsArray, IsString, MinLength } from 'class-validator';

export class CreateBoardDto {
  @IsArray()
  @IsString({ each: true })
  pins: string[];

  @MinLength(1)
  @IsString()
  title: string;

  @MinLength(1)
  @IsString()
  userId: string;
}
