import { Module } from '@nestjs/common';
import { PremiumController } from './premium.controller';
import { PremiumService } from './premium.service';
import { UserService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PremiumController],
  providers: [PremiumService, UserService, PrismaService],
})
export class PremiumModule {}
