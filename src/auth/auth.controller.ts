import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const userById = await this.userService.findUserByUserId(dto.userId);
    const user = await this.userService.findUserByEmail(dto.email);

    if (user) {
      throw new BadRequestException('User with such email already exists');
    }

    if (userById) {
      console.log(userById);
      throw new BadRequestException('User with such id already exists');
    }

    await this.userService.createUser(dto);

    return {
      message: 'User registered',
    };
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login() {
    return {
      message: 'Success',
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('check')
  async check() {
    return { loggedIn: true };
  }

  @Delete('clear')
  async clearUsers() {
    await this.userService.deleteAllUsers();
    return 'cleared';
  }
}
