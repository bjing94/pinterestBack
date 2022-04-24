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
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get(':id')
  // async getUserByDisplayId(@Param('id') displayId: string) {
  //   console.log('User id:', displayId);
  //   const user = await this.userService.findUserByDisplayId(displayId);
  //   if (!user) {
  //     throw new NotFoundException('User not found!');
  //   }
  //   console.log(user);
  //   return user;
  // }

  @Get(':id')
  async getUserById(@Param('id') _id: string) {
    console.log('User id:', _id);
    const user = await this.userService.findUserById(_id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    console.log(user);
    return user;
  }
  @UseGuards(AuthenticatedGuard)
  @Post('subscribe/:id')
  async subscribe(
    @Param('id') subscriptionDisplayId: string,
    @Req() req: Express.Request,
  ) {
    const subscriptionId = (
      await this.userService.findUserByDisplayId(subscriptionDisplayId)
    )
      .toObject()
      ._id.toString();
    const subscriberId = req.user['_id'];

    if (subscriberId == subscriptionId) {
      throw new BadRequestException('Cannot subscribe to yourself!');
    }
    const subscriber = await this.userService.findUserById(subscriberId);
    if (!subscriber) {
      throw new NotFoundException('Subscriber not found!');
    }
    const subscription = await this.userService.findUserById(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found!');
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
