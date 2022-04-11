import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreatePinDto } from './dto/create-pin.dto';
import { FindPinDto } from './dto/find-pin.dto';
import { PinModel } from './pin.model';

@Injectable()
export class PinService {
  constructor(
    @InjectModel(PinModel) private readonly pinModel: ModelType<PinModel>,
  ) {}

  async createPin(dto: CreatePinDto) {
    return this.pinModel.create(dto);
  }

  async findPinById(id: string) {
    return this.pinModel.findById(id).exec();
  }

  async findPin({ title, random }: FindPinDto) {
    if (random) {
      return this.pinModel.find().exec();
    } else {
      return this.pinModel.find({ title }).exec();
    }
  }

  async deletePinById(id: string) {
    return this.pinModel.findByIdAndDelete(id).exec();
  }

  async updatePinById(id: string, dto: CreatePinDto) {
    return this.pinModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
