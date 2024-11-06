import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly UsersService: UserService) {}

  @Get()
  getUsers(): Promise<any> {
    return this.UsersService.getUsers();
  }

  @Get('search')
  async getUserBySearch(
    @Query('query') query: string,
    @Query('userId') userId: string,
  ) {
    return this.UsersService.getUserBySearch({ query, userId });
  }

  @Get(':userId')
  getUserById(@Param('userId') userId: string) {
    return this.UsersService.getUserById({ userId });
  }
}
