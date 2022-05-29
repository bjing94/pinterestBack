import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Response,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import { FILE_NOT_DEFINED, FILE_NOT_FOUND } from './files.constants';
import { FilesService } from './files.service';
import { ruToEng } from 'src/helpers/translit';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('files'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() additionaInfo,
  ) {
    if (!file) {
      throw new BadRequestException(FILE_NOT_DEFINED);
    }
    return this.filesService.saveFile(file);
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Response() res) {
    const fileInfo = await this.filesService.getFile(id);
    if (!fileInfo) {
      throw new NotFoundException(FILE_NOT_FOUND);
    }

    const fileStream = createReadStream(
      `${process.env.IMAGES_PATH}${fileInfo.url}`,
    );

    const latinName = ruToEng(fileInfo.fileName);
    console.log(
      'Downloading file: ',
      `${process.env.IMAGES_PATH}${fileInfo.url}`,
      fileInfo.fileName,
    );
    res.setHeader('Content-Disposition', `attachment; filename=${latinName}`);

    fileStream.pipe(res);
  }

  @Get(':id')
  async get(@Param('id', MongoIdValidationPipe) id: string) {
    const fileInfo = await this.filesService.getFile(id);
    if (!fileInfo) {
      throw new NotFoundException(FILE_NOT_FOUND);
    }

    return fileInfo;
  }
}
