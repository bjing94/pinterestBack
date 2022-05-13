import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import {
  USER_CANNOT_SUBSCRIBE,
  USER_NOT_FOUND,
  USER_SUBSCRIBER_NOT_FOUND,
  USER_SUBSCRIBTION_NOT_FOUND,
} from './user.constants';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') _id: string) {
    console.log('User id:', _id);
    const user = await this.userService.findUserById(_id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    console.log(user);
    return user;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('subscribe/:id')
  async subscribe(@Param('id') _id: string, @Req() req: Express.Request) {
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
    await this.userService.updateUserById(subscriberId, subscriberObj);

    const subscriptionObj = subscription.toObject();
    subscriptionObj.subscribers.push(subscriberId);
    return this.userService.updateUserById(subscriptionId, subscriptionObj);
  }

  @UsePipes(new ValidationPipe())
  @Post('find')
  async find(@Body() dto: FindUserDto) {
    return this.userService.findUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, dto);
  }
}
