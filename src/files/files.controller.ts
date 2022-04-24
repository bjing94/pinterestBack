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
import { path } from 'app-root-path';
import { createReadStream } from 'fs';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import { FilesService } from './files.service';

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
      throw new BadRequestException('File should be defined!');
    }
    return this.filesService.saveFile(file);
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Response() res) {
    const fileInfo = await this.filesService.getFile(id);
    if (!fileInfo) {
      throw new NotFoundException('File does not exist');
    }

    const fileStream = createReadStream(`${path}/uploads/${fileInfo.url}`);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileInfo.fileName}`,
    );

    fileStream.pipe(res);
  }

  @Get(':id')
  async get(@Param('id', MongoIdValidationPipe) id: string) {
    const fileInfo = await this.filesService.getFile(id);
    if (!fileInfo) {
      throw new NotFoundException('File does not exist');
    }

    return fileInfo;
  }
}
