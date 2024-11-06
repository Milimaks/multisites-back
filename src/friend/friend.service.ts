import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FriendRequestDto } from './dto/friend-request.dto';
import { Friend, FriendRequest, User } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to send a friend request
  async sendFriendRequest(
    createFriendRequestDto: FriendRequestDto,
  ): Promise<FriendRequest> {
    return this.prisma.friendRequest.create({
      data: {
        senderUserId: createFriendRequestDto.senderUserId,
        receiverUserId: createFriendRequestDto.receiverUserId,
      },
    });
  }

  // Method to accept a friend request
  async acceptFriendRequest(friendRequestId: string): Promise<FriendRequest> {
    // Step 1: Find and verify the request
    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: { id: friendRequestId },
    });

    if (!friendRequest) {
      throw new Error('Friend request not found');
    }

    // Step 2: Create a friend relationship between the two users
    await this.prisma.friend.create({
      data: {
        user1Id: friendRequest.senderUserId,
        user2Id: friendRequest.receiverUserId,
      },
    });

    // Step 3: Update the request status to 'ACCEPTED'
    return this.prisma.friendRequest.update({
      where: { id: friendRequestId },
      data: { status: 'ACCEPTED' },
    });
  }

  // Method to decline a friend request
  async declineFriendRequest(friendRequestId: string): Promise<FriendRequest> {
    return this.prisma.friendRequest.update({
      where: { id: friendRequestId },
      data: { status: 'DECLINED' },
    });
  }

  // Method to find all friend requests for a user
  async findFriendRequestsForUser(userId: string): Promise<FriendRequest[]> {
    return this.prisma.friendRequest.findMany({
      where: {
        receiverUserId: userId,
        status: 'PENDING',
      },
      select: {
        id: true,
        senderUserId: true,
        receiverUserId: true,
        status: true,
        createdAt: true,
        senderUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Method to remove a friend
  async removeFriend(user1Id: string, user2Id: string): Promise<Friend> {
    const friendRelationship = await this.prisma.friend.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });

    if (!friendRelationship) {
      throw new Error('Friendship not found');
    }

    // Store the friend's data before deletion, assuming Friend matches the Friend model structure
    const friendData: Friend = {
      id: friendRelationship.id,
      user1Id: friendRelationship.user1Id,
      user2Id: friendRelationship.user2Id,
      createdAt: friendRelationship.createdAt,
    };

    // Remove the friendship
    await this.prisma.friend.delete({
      where: { id: friendRelationship.id },
    });

    return friendData; // Return the friend data if needed
  }

  // Method to get all friends for a user
  // Method to get all friends for a user
  async getAllFriendsForUser(
    userId: string,
  ): Promise<{ id: string; firstName: string; lastName: string }[]> {
    const friends = await this.prisma.friend.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: {
        user1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        user2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return friends.map((friend) =>
      friend.user1.id === userId
        ? {
            id: friend.user2.id,
            firstName: friend.user2.firstName,
            lastName: friend.user2.lastName,
          }
        : {
            id: friend.user1.id,
            firstName: friend.user1.firstName,
            lastName: friend.user1.lastName,
          },
    );
  }
}
