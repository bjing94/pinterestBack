import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_NOT_FOUND, WRONG_PASSWORD } from './user.constants';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {}

  async findUserById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findUserByUserId(userId: string) {
    return this.userModel.findOne({ userId }).exec();
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(dto: CreateUserDto) {
    console.log('User dto:', dto);
    const salt = await genSalt(7);
    const hashedPassword = await hash(dto.password, salt);

    const newUser = new this.userModel({
      userId: dto.userId,
      email: dto.email,
      passwordHash: hashedPassword,
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
      throw new BadRequestException(WRONG_PASSWORD);
    }
    return foundUser;
  }
}
