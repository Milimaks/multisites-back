import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PremiumModule } from './premium/premium.module';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot({ isGlobal: true }), PremiumModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
