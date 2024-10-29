import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { PrismaService } from 'src/prisma.service';
import { FriendRequestController } from './friend-request.controller';

@Module({
  providers: [PrismaService, FriendRequestService],
  controllers: [FriendRequestController],
})
export class FriendRequestModule {}
