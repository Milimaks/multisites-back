import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogUserDto } from './dto/log-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() authBody: LogUserDto): Promise<any> {
    return this.authService.signIn({ authBody });
  }
}
