import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendRequestService } from './friend-request.service';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createFriendRequestDto: FriendRequestDto) {
    await this.friendRequestService.sendFriendRequest({
      senderUserId: createFriendRequestDto.senderUserId,
      receiverUserId: createFriendRequestDto.receiverUserId,
    });
    return { message: 'Friend request sent successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findFriendRequestsForUser(@Req() req) {
    const userId = req.user.userId;
    const friendRequests =
      await this.friendRequestService.findFriendRequestsForUser(userId);
    return { friendRequests };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  async acceptFriendRequest(@Param('id') friendRequestId: string) {
    await this.friendRequestService.acceptFriendRequest(friendRequestId);
    return { message: 'Friend request accepted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/decline')
  async declineFriendRequest(@Param('id') friendRequestId: string) {
    await this.friendRequestService.declineFriendRequest(friendRequestId);
    return { message: 'Friend request declined successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':user1Id/:user2Id')
  async removeFriend(
    @Param('user1Id') senderUserId: string,
    @Param('user2Id') receiverUserId: string,
  ) {
    const friendData = await this.friendRequestService.removeFriend(
      senderUserId,
      receiverUserId,
    );
    return {
      message: 'Friend removed successfully',
      friend: friendData,
    };
  }
}
