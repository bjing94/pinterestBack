import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { FileModel } from './file.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
    }),
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
