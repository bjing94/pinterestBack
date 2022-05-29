import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { path } from 'app-root-path';
import { createReadStream, ensureDir, readFile, writeFile } from 'fs-extra';
import * as dateFns from 'date-fns';
import { InjectModel } from 'nestjs-typegoose';
import { FileModel } from './file.model';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { fstat } from 'fs';
import { ruToEng } from 'src/helpers/translit';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileModel) private readonly fileModel: ModelType<FileModel>,
  ) {}

  async saveFile(file: Express.Multer.File): Promise<DocumentType<FileModel>> {
    const dateString = dateFns.format(new Date(), 'MM-dd-yyyy');
    const uploadFolder = process.env.IMAGES_PATH + `/${dateString}`;
    const latinName = ruToEng(file.originalname);
    await ensureDir(uploadFolder);

    await writeFile(`${uploadFolder}/${latinName}`, file.buffer);

    //Then add file info to DB

    return this.fileModel.create({
      fileName: latinName,
      url: `${dateString}/${latinName}`,
    });
  }

  async getFile(id: string) {
    return this.fileModel.findById(id).exec();
  }
}
