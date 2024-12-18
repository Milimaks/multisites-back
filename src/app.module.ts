import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './app.gateway';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { FriendModule } from './friend/friend.module';
import { PremiumModule } from './premium/premium.module';
import { SocketModule } from './socket/socket.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PremiumModule,
    FriendModule,
    ChatModule,
    SocketModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
