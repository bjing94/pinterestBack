import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './configs/mongo.config';
import { PinModule } from './pin/pin.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';
import { ApiKeyMiddleware } from './auth/middlewares/api-key.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMongoConfig,
      inject: [ConfigService],
    }),
    PinModule,
    FilesModule,
    AuthModule,
    UserModule,
    SearchModule,
    BoardModule,
    CommentModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes('/user', '/pin', '/board', '/search', '/comment', '/auth');
  }
}
