import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { PrismaService } from 'src/prisma.service';
import { FriendController } from './friend.controller';

@Module({
  providers: [PrismaService, FriendService],
  controllers: [FriendController],
})
export class FriendModule {}
