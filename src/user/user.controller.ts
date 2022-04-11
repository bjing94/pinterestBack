import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserByUserId(@Param('id') userId: string) {
    console.log('User id:', userId);
    const user = await this.userService.findUserByUserId(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    console.log(user);
    return user;
  }
}
