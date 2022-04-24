import { IsArray, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsArray()
  @IsString({ each: true })
  pins: string[];

  @IsString()
  title: string;

  @IsString()
  userId: string;
}
