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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    const board = await this.boardService.findBoardById(id);
    if (!board) {
      throw new NotFoundException('Board not found!');
    }
    return this.boardService.getBoardById(id);
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateBoardDto) {
    const user = await this.userService.findUserById(dto.userId);
    if (!user) {
      throw new BadRequestException('Board owner not found!');
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

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return this.boardService.updateBoardById(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const boardData = await this.boardService.findBoardById(id);
    if (!boardData) {
      throw new NotFoundException('Board  not found!');
    }

    const boardOwner = await this.userService.findUserById(
      boardData.toObject().userId,
    );
    if (!boardOwner) {
      throw new BadRequestException('Board owner not found!');
    }

    const newUser = { ...boardOwner.toObject() };
    newUser.boards = newUser.boards.filter((board) => board !== id);
    await this.userService.updateUserById(newUser._id.toString(), newUser);
    return this.boardService.deleteBoardById(id);
  }
}
