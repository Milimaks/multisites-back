import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly UsersService: UserService) {}

  @Get()
  getUsers(): Promise<any> {
    return this.UsersService.getUsers();
  }

  @Get('search')
  async getUserBySearch(@Query('query') query: string) {
    return this.UsersService.getUserBySearch({ query });
  }

  @Get(':userId')
  getUserById(@Param('userId') userId: string) {
    return this.UsersService.getUserById({ userId });
  }
}
