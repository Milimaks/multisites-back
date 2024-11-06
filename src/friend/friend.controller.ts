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
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  // Endpoint for getting friends
  @UseGuards(JwtAuthGuard)
  @Get()
  async getFriends(@Req() req) {
    const userId = req.body.id;
    const friends = await this.friendService.getAllFriendsForUser(userId);
    return { friends };
  }
  // Endpoint for sending a friend request
  @UseGuards(JwtAuthGuard)
  @Post('request')
  async sendFriendRequest(@Body() friendRequestDto: FriendRequestDto) {
    await this.friendService.sendFriendRequest({
      senderUserId: friendRequestDto.senderUserId,
      receiverUserId: friendRequestDto.receiverUserId,
    });
    return { message: 'Friend request sent successfully' };
  }

  // Endpoint for finding friend requests for a user
  @UseGuards(JwtAuthGuard)
  @Get('requests')
  async findFriendRequestsForUser(@Req() req) {
    const userId = req.user.userId;
    const friendRequests =
      await this.friendService.findFriendRequestsForUser(userId);
    return { friendRequests };
  }

  // Endpoint for accepting a friend request
  @UseGuards(JwtAuthGuard)
  @Post('request/:id/accept')
  async acceptFriendRequest(@Param('id') friendRequestId: string) {
    await this.friendService.acceptFriendRequest(friendRequestId);
    return { message: 'Friend request accepted successfully' };
  }

  // Endpoint for declining a friend request
  @UseGuards(JwtAuthGuard)
  @Post('request/:id/decline')
  async declineFriendRequest(@Param('id') friendRequestId: string) {
    await this.friendService.declineFriendRequest(friendRequestId);
    return { message: 'Friend request declined successfully' };
  }

  // Endpoint for removing a friend
  @UseGuards(JwtAuthGuard)
  @Delete(':user1Id/:user2Id')
  async removeFriend(
    @Param('user1Id') user1Id: string,
    @Param('user2Id') user2Id: string,
  ) {
    const friendData = await this.friendService.removeFriend(user1Id, user2Id);
    return {
      message: 'Friend removed successfully',
      friend: friendData,
    };
  }
}
