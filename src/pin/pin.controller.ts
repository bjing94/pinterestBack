import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { BOARD_NOT_FOUND } from 'src/board/board.constants';
import { BoardService } from 'src/board/board.service';
import { CreateBoardDto } from 'src/board/dto/create-board.dto';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { USER_NOT_FOUND } from 'src/user/user.constants';
import { UserModel } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import {
  PIN_LIMIT,
  PIN_LIMIT_EXCEED,
  PIN_NOT_FOUND,
  PIN_PERMISSION_DENIED,
} from './constants/pin.constants';
import { CreatePinDto } from './dto/create-pin.dto';
import { FindPinDto } from './dto/find-pin.dto';
import { UpdatePinDto } from './dto/update-pin.dto';
import { UserIsPinOwnerGuard } from './guards/user-is-pin-owner.guard';
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

  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreatePinDto) {
    const user = await this.userService.findUserById(dto.userId);
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    if (user.toObject().createdPins.length >= PIN_LIMIT) {
      throw new BadRequestException(PIN_LIMIT_EXCEED);
    }
    let board = undefined;
    if (dto.boardId) {
      board = await this.boardService.findBoardById(dto.boardId);
      if (!board) {
        throw new BadRequestException(BOARD_NOT_FOUND);
      }
    }
    const { boardId, ...rest } = dto;
    const createdPin = await this.pinService.createPin(rest);

    const newUserDto = user.toObject() as UpdateUserDto;
    newUserDto.createdPins.push(createdPin._id.toString());

    if (dto.boardId && board) {
      console.log('PIN: saving to board', boardId);
      const newBoardDto = board.toObject() as CreateBoardDto;
      newBoardDto.pins.push(createdPin._id.toString());
      await this.boardService.updateBoardById(dto.boardId, newBoardDto);
    }
    if (!dto.boardId) {
      console.log('PIN: saving to profile');
      newUserDto.savedPins.push(createdPin._id.toString());
    }
    await this.userService.updateUserById(dto.userId, newUserDto);
    return createdPin;
  }

  @UseGuards(AuthenticatedGuard, UserIsPinOwnerGuard)
  @Delete(':id')
  async delete(
    @Param('id', MongoIdValidationPipe) id: string,
    @Req() req: Express.Request,
  ) {
    const pinData = await this.pinService.findPinById(id);
    if (!pinData) {
      throw new NotFoundException(PIN_NOT_FOUND);
    }
    if ((req.user as UserModel)._id.toString() !== pinData.toObject().userId) {
      throw new BadRequestException(PIN_PERMISSION_DENIED);
    }
    // console.log(pinData.toObject().title, id);

    const creator = await this.userService.findUserById(
      pinData.toObject().userId,
    );

    const newCreatedPins = creator
      .toObject()
      .createdPins.filter((pin) => pin !== id);
    await this.userService.updateUserById(creator.toObject()._id.toString(), {
      createdPins: newCreatedPins,
    });

    const whoSaved = await this.userService.findUsersBySavedPin(id); // delete from people who have it saved

    const newUsers = await whoSaved.map((user) => {
      const newSavedPins = user
        .toObject()
        .savedPins.filter((pin) => pin !== id);
      return this.userService.updateUserById(user.toObject()._id.toString(), {
        savedPins: newSavedPins,
      });
    });

    const boards = await this.boardService.findBoardsBySavedPin(id); // delete from boards
    const newBoards = await boards.map((board) => {
      const newPins = board.toObject().pins.filter((pin) => pin !== id);
      return this.boardService.updateBoardById(
        board.toObject()._id.toString(),
        { pins: newPins },
      );
    });
    return this.pinService.deletePinById(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  async patch(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() dto: UpdatePinDto,
    @Req() req: Express.Request,
  ) {
    // If updating only comments
    if (Object.keys(dto).length === 1 && dto.comments !== undefined) {
      const pin = await this.pinService.updatePinById(id, dto);
      if (!pin) {
        throw new NotFoundException(PIN_NOT_FOUND);
      }
      return pin;
    }

    // check if he is the owner
    const userId = req.user['_id'];

    const pin = await this.pinService.findPinById(id);
    if (!pin || userId !== pin.userId) {
      throw new ForbiddenException(PIN_PERMISSION_DENIED);
    }

    const updatedPin = await this.pinService.updatePinById(id, dto);
    if (!updatedPin) {
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
