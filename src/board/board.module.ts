import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BoardModel } from './board.model';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: BoardModel,
        schemaOptions: {
          collection: 'Board',
        },
      },
    ]),
    UserModule,
  ],
  providers: [BoardService],
  controllers: [BoardController],
  exports: [BoardService],
})
export class BoardModule {}
