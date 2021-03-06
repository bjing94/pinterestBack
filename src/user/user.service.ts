import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_NOT_FOUND, USER_WRONG_PASSWORD } from './user.constants';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {}

  async findUserById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findUserByDisplayId(displayId: string) {
    return this.userModel.findOne({ displayId }).exec();
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(dto: CreateUserDto) {
    console.log('User dto:', dto);
    const salt = await genSalt(7);
    const hashedPassword = await hash(dto.password, salt);

    const newUser = new this.userModel({
      username: dto.username,
      displayId: dto.displayId,
      email: dto.email,
      passwordHash: hashedPassword,
      avatarSrc: '', //placeholder avatar
      createdPins: [],
      savedPins: [], // profile pins
      boards: [],
      subscribers: [],
      subscriptions: [],
    });
    return newUser.save();
  }

  async deleteUserById(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async deleteAllUsers() {
    return this.userModel.deleteMany().exec();
  }

  async validateUser({ email, password }: { email: string; password: string }) {
    const foundUser = await this.findUserByEmail(email);
    if (!foundUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    const areEqual = await compare(password, foundUser.passwordHash);
    if (!areEqual) {
      throw new BadRequestException(USER_WRONG_PASSWORD);
    }
    return foundUser;
  }

  async updateUserById(id: string, dto: UpdateUserDto) {
    if (!dto.newPassword) {
      return this.userModel
        .findByIdAndUpdate(id, { ...dto }, { new: true })
        .exec();
    }

    const salt = await genSalt(7);
    const hashedPassword = await hash(dto.newPassword, salt);
    const { newPassword, ...rest } = dto;

    return this.userModel
      .findByIdAndUpdate(
        id,
        { ...rest, passwordHash: hashedPassword },
        { new: true },
      )
      .exec();
  }

  async updateUserByDisplayId(displayId: string, dto: UpdateUserDto) {
    return this.userModel
      .findOneAndUpdate({ displayId }, dto, { new: true })
      .exec();
  }

  async findUser(dto: FindUserDto) {
    return this.userModel.findOne(dto).exec();
  }

  async findUsersBySavedPin(pinId: string) {
    return this.userModel.find({ savedPins: { $in: [pinId] } }).exec();
  }

  async findUsersByCreatedPin(pinId: string) {
    return this.userModel.find({ createdPins: { $in: [pinId] } }).exec();
  }
}
