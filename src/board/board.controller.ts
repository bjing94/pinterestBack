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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import { USER_NOT_FOUND } from 'src/user/user.constants';
import { UserService } from 'src/user/user.service';
import { BOARD_NOT_FOUND } from './board.constants';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { UserIsBoardOwnerGuard } from './guards/user-is-board-owner.guard';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  async get(@Param('id', MongoIdValidationPipe) id: string) {
    const board = await this.boardService.findBoardById(id);
    if (!board) {
      throw new NotFoundException(BOARD_NOT_FOUND);
    }
    return this.boardService.findBoardById(id);
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateBoardDto) {
    const user = await this.userService.findUserById(dto.userId);
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }
    const newBoard = await this.boardService.createBoard(dto);
    const newUser = { ...user.toObject() };
    newUser.boards.push(newBoard._id.toString());
    const modifiedUser = await this.userService.updateUserById(
      dto.userId,
      newUser,
    );
    console.log(modifiedUser);
    return newBoard;
  }

  @UseGuards(AuthenticatedGuard, UserIsBoardOwnerGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return this.boardService.updateBoardById(id, dto);
  }

  @UseGuards(AuthenticatedGuard, UserIsBoardOwnerGuard)
  @Delete(':id')
  async delete(@Param('id', MongoIdValidationPipe) id: string) {
    const boardData = await this.boardService.findBoardById(id);
    if (!boardData) {
      throw new NotFoundException(BOARD_NOT_FOUND);
    }

    const boardOwner = await this.userService.findUserById(
      boardData.toObject().userId,
    );
    if (!boardOwner) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const newUser = { ...boardOwner.toObject() };
    newUser.boards = newUser.boards.filter((board) => board !== id);
    await this.userService.updateUserById(newUser._id.toString(), newUser);
    return this.boardService.deleteBoardById(id);
  }
}
