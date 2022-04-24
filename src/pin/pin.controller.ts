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
import { BoardService } from 'src/board/board.service';
import { CreateBoardDto } from 'src/board/dto/create-board.dto';
import { FilesService } from 'src/files/files.service';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserService } from 'src/user/user.service';
import { PIN_NOT_FOUND } from './constants/pin.constants';
import { CreatePinDto } from './dto/create-pin.dto';
import { FindPinDto } from './dto/find-pin.dto';
import { PinService } from './pin.service';

@Controller('pin')
export class PinController {
  constructor(
    private readonly pinService: PinService,
    private readonly userService: UserService,
    private readonly boardService: BoardService,
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
    const user = await this.userService.findUserById(dto.userId);
    if (!user) {
      throw new BadRequestException('No such user!');
    }

    const board = await this.boardService.getBoardById(dto.boardId);
    if (!board) {
      throw new BadRequestException('No such board!');
    }
    const createdPin = await this.pinService.createPin(dto);

    const newUserDto = user.toObject() as UpdateUserDto;
    newUserDto.createdPins.push(createdPin._id.toString());
    await this.userService.updateUserById(dto.userId, newUserDto);

    const newBoardDto = board.toObject() as CreateBoardDto;
    newBoardDto.pins.push(createdPin._id.toString());
    await this.boardService.updateBoardById(dto.boardId, newBoardDto);

    return createdPin;
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
