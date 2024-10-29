import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PremiumModule } from './premium/premium.module';
import { FriendRequestService } from './friend-request/friend-request.service';
import { FriendRequestModule } from './friend-request/friend-request.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PremiumModule,
    FriendRequestModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
