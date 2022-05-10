import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
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
    console.log('finding by userId');
    const userById = await this.userService.findUserByDisplayId(dto.displayId);
    console.log('finding by email');
    const userByEmail = await this.userService.findUserByEmail(dto.email);

    if (userByEmail) {
      throw new BadRequestException('User with such email already exists');
    }

    if (userById) {
      throw new BadRequestException('User with such id already exists');
    }

    console.log('trying to create');
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

  @HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  async logout(@Request() req: Express.Request) {
    req.logOut();
    return {
      message: 'Success',
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('check')
  async check(@Request() req: Express.Request) {
    return { loggedIn: true };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('session-info')
  async getSessionInfo(@Request() req: Express.Request) {
    const currentUser = await this.userService.findUserById(req.user['_id']);
    if (!currentUser) {
      throw new NotFoundException('User not found!');
    }
    return currentUser;
  }

  @Delete('clear')
  async clearUsers() {
    await this.userService.deleteAllUsers();
    return 'cleared';
  }
}
