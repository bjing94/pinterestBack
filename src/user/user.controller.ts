import {
  BadRequestException,
  Body,
  Controller,
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
import { MongoIdValidationPipe } from 'src/pipes/mongo-id-validation.pipe';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserIsUserGuard } from './guards/is-user.guard';
import { UserDataResponse } from './responses/user.data.response';
import {
  USER_CANNOT_SUBSCRIBE,
  USER_NOT_FOUND,
  USER_SUBSCRIBER_NOT_FOUND,
  USER_SUBSCRIBTION_NOT_FOUND,
  USER_UPDATED,
  USER_UPDATE_FAILED,
  USER_WRONG_DATA,
} from './user.constants';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Get(':id')
  async getUserByDisplayId(@Param('id') id: string): Promise<UserDataResponse> {
    console.log('User Id:', id);
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const {
      _id,
      displayId,
      username,
      avatarSrc,
      description,
      subscribers,
      subscriptions,
      boards,
      createdPins,
      savedPins,
      createdAt,
    } = user;

    const userId = _id.toString();

    return {
      _id: userId,
      username,
      displayId,
      avatarSrc,
      description,
      subscribers,
      subscriptions,
      boards,
      createdPins,
      savedPins,
      createdAt,
    };
  }

  @HttpCode(200)
  @UseGuards(AuthenticatedGuard)
  @Post('subscribe/:id')
  async subscribe(
    @Param('id') _id: string,
    @Req() req: Express.Request,
  ): Promise<UserUpdateResponse> {
    const subscriptionId = (await this.userService.findUserById(_id))
      .toObject()
      ._id.toString();
    const subscriberId = req.user['_id'];

    if (subscriberId == subscriptionId) {
      throw new BadRequestException(USER_CANNOT_SUBSCRIBE);
    }
    const subscriber = await this.userService.findUserById(subscriberId);
    if (!subscriber) {
      throw new NotFoundException(USER_SUBSCRIBER_NOT_FOUND);
    }
    const subscription = await this.userService.findUserById(subscriptionId);
    if (!subscription) {
      throw new NotFoundException(USER_SUBSCRIBTION_NOT_FOUND);
    }
    const subscriberObj = subscriber.toObject();
    subscriberObj.subscriptions.push(subscriptionId);
    const updatedSubscriber = await this.userService.updateUserById(
      subscriberId,
      subscriberObj,
    );

    const subscriptionObj = subscription.toObject();
    subscriptionObj.subscribers.push(subscriberId);
    const updatedSubscribtioner = await this.userService.updateUserById(
      subscriptionId,
      subscriptionObj,
    );

    if (!updatedSubscriber || !updatedSubscribtioner) {
      return {
        msg: USER_UPDATE_FAILED,
      };
    }
    return {
      msg: USER_UPDATED,
    };
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('find')
  async find(@Body() dto: FindUserDto): Promise<UserDataResponse> {
    const userFound = await this.userService.findUser(dto);
    if (!userFound) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    const {
      _id,
      username,
      displayId,
      avatarSrc,
      description,
      subscribers,
      subscriptions,
      boards,
      createdPins,
      savedPins,
      createdAt,
    } = userFound;

    const userId = _id.toString();
    console.log(userFound);
    return {
      _id: userId,
      username,
      displayId,
      avatarSrc,
      description,
      subscribers,
      subscriptions,
      boards,
      createdPins,
      savedPins,
      createdAt,
    };
  }

  @HttpCode(200)
  @UseGuards(AuthenticatedGuard, UserIsUserGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserUpdateResponse> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const updatedUser = this.userService.updateUserById(id, dto);
    if (!updatedUser) {
      throw new BadRequestException(USER_WRONG_DATA);
    }

    return {
      msg: USER_UPDATED,
    };
  }
}
