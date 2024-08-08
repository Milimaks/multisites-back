import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
})
export class UsersModule {}
