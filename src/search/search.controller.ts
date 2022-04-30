import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  ParseBoolPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PIN_NOT_FOUND } from 'src/pin/constants/pin.constants';
import { PinService } from 'src/pin/pin.service';
import { FindUserDto } from 'src/user/dto/find-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly pinService: PinService,
    private readonly userService: UserService,
  ) {}

  @Get('pins')
  async get(
    @Query('q') queryStr: string,
    @Query('random', ParseBoolPipe) isRandom: boolean,
  ) {
    const pins = await this.pinService.findPin({
      title: queryStr,
      random: isRandom,
    });
    const allPins = await this.pinService.findPin({
      title: 'test',
      random: true,
    });
    console.log(allPins);
    if (!pins.length) {
      throw new NotFoundException(PIN_NOT_FOUND);
    }
    return pins;
  }

  @HttpCode(200)
  @Post('users')
  async post(@Body() dto: FindUserDto) {
    const user = await this.userService.findUser(dto);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}
