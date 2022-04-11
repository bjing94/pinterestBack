import { Module } from '@nestjs/common';
import { PinModule } from 'src/pin/pin.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [PinModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
