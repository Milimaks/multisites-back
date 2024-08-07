import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogUserDto } from './dto/log-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // 1. Send a password and email
  // 2. API send back a JWT token

  @Post('login')
  async signIn(@Body() authBody: LogUserDto): Promise<any> {
    return this.authService.signIn({ authBody });
  }

  // 3. Send the JWT token in the header of the request
  @UseGuards(JwtAuthGuard)
  @Get()
  async authenticateUser(@Req() request) {
    console.log(request.user);
    return;
  }
}
