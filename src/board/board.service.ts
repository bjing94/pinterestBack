import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { BoardModel } from './board.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(BoardModel) private readonly boardModel: ModelType<BoardModel>,
  ) {}

  async createBoard(dto: CreateBoardDto) {
    return this.boardModel.create(dto);
  }

  async updateBoardById(id: string, dto: UpdateBoardDto) {
    return this.boardModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteBoardById(id: string) {
    return this.boardModel.findByIdAndDelete(id).exec();
  }

  async findBoardById(id: string) {
    return this.boardModel.findById(id).exec();
  }

  async findBoardsBySavedPin(pinId: string) {
    return this.boardModel.find({ pins: { $in: [pinId] } }).exec();
  }
}
