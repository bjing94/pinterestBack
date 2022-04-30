import { Module } from '@nestjs/common';
import { PinModule } from 'src/pin/pin.module';
import { UserModule } from 'src/user/user.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [PinModule, UserModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
