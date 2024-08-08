import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogUserDto } from './dto/log-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from './jwt.strategy';
import { UserService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  // 1. Send a password and email
  // 2. API send back a JWT token

  @Post('login')
  async signIn(@Body() authBody: LogUserDto): Promise<any> {
    return this.authService.signIn({ authBody });
  }
  @Post('register')
  async signUp(@Body() authBody: CreateUserDto): Promise<any> {
    return this.authService.signUp({ authBody });
  }

  // 3. Send the JWT token in the header of the request
  @UseGuards(JwtAuthGuard)
  @Get()
  async authenticateUser(@Req() request: RequestWithUser) {
    return await this.userService.getUserById({ userId: request.user.userId });
  }
}
