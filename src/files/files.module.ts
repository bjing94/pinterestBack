import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { FileModel } from './file.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: FileModel,
        schemaOptions: {
          collection: 'Files',
        },
      },
    ]),
  ],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
