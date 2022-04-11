import {
  Controller,
  Get,
  NotFoundException,
  ParseBoolPipe,
  Query,
} from '@nestjs/common';
import { PIN_NOT_FOUND } from 'src/pin/constants/pin.constants';
import { PinService } from 'src/pin/pin.service';

@Controller('search')
export class SearchController {
  constructor(private readonly pinService: PinService) {}

  @Get('pins')
  async get(
    @Query('q') queryStr: string,
    @Query('random', ParseBoolPipe) isRandom: boolean,
  ) {
    const pins = await this.pinService.findPin({
      title: queryStr,
      random: isRandom,
    });
    if (!pins.length) {
      throw new NotFoundException(PIN_NOT_FOUND);
    }
    return pins;
  }
}
