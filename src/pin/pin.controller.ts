import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import { PIN_NOT_FOUND } from './constants/pin.constants';
import { CreatePinDto } from './dto/create-pin.dto';
import { FindPinDto } from './dto/find-pin.dto';
import { PinService } from './pin.service';

@Controller('pin')
export class PinController {
  constructor(
    private readonly pinService: PinService,
    private readonly filesService: FilesService,
  ) {}

  @Get(':id')
  async get(@Param('id', MongoIdValidationPipe) id: string) {
    const pin = await this.pinService.findPinById(id);
    if (!pin) {
      throw new NotFoundException(PIN_NOT_FOUND);
    }
    return pin;
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreatePinDto) {
    return this.pinService.createPin(dto);
  }

  @Delete(':id')
  async delete(@Param('id', MongoIdValidationPipe) id: string) {
    const pin = await this.pinService.deletePinById(id);
    if (!pin) {
      throw new NotFoundException(PIN_NOT_FOUND);
    }
    return pin;
  }

  @Patch(':id')
  async patch(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() dto: CreatePinDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const pin = await this.pinService.updatePinById(id, dto);
    if (!pin) {
      throw new NotFoundException(PIN_NOT_FOUND);
    }
    return pin;
  }

  @UsePipes(new ValidationPipe())
  @Post('find')
  async find(@Body() dto: FindPinDto) {
    const pins = await this.pinService.findPin(dto);
    if (!pins.length) {
      throw new NotFoundException(PIN_NOT_FOUND);
    }
    return pins;
  }
}
