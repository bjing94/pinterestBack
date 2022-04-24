import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BoardModule } from 'src/board/board.module';
import { FilesModule } from 'src/files/files.module';
import { UserModule } from 'src/user/user.module';
import { PinController } from './pin.controller';
import { PinModel } from './pin.model';
import { PinService } from './pin.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PinModel,
        schemaOptions: {
          collection: 'Pin',
        },
      },
    ]),
    FilesModule,
    UserModule,
    BoardModule,
  ],
  controllers: [PinController],
  providers: [PinService],
  exports: [PinService],
})
export class PinModule {}
