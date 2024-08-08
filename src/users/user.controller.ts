import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly UsersService: UserService) {}

  @Get()
  getUsers(): Promise<any> {
    return this.UsersService.getUsers();
  }

  @Get(':userId')
  getUserById(@Param('userId') userId: string) {
    return this.UsersService.getUserById({ userId });
  }
}
