import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PremiumModule } from './premium/premium.module';
import { FriendService } from './friend/friend.service';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PremiumModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
