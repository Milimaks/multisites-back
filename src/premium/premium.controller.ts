import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PremiumService } from './premium.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('premium')
export class PremiumController {
  constructor(private readonly premiumService: PremiumService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new-trial')
  async givePremiumTrial(@Req() req: any) {
    const user = req.user;
    return this.premiumService.newTrial(user.userId);
  }
}
