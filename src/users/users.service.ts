import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        email: true,
      },
    });
    return users;
  }

  async getUserById({ userId }: { userId: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async updateUser(user: any) {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }

  async getUserBySearch({ query }: { query: string }) {
    const findedUsers = await this.prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return findedUsers.map((user) => {
      return {
        firstName: user.firstName,
      };
    });
  }
}
