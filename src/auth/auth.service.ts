import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LogUserDto } from './dto/log-user.dto';
import * as bcrypt from 'bcrypt';
import { hash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signIn({ authBody }: { authBody: LogUserDto }) {
    const { email, password } = authBody;
    const hashedPassword = await this.hashPassword({ password });

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      throw new Error('User not found');
    }
    if (existingUser.password !== password || existingUser.email !== email) {
      throw new Error('Invalid password or email');
    }
    this.isPasswordValide({ password, hashedPassword });

    return existingUser;
  }

  // This function hashes the password using bcrypt.
  private async hashPassword({ password }: { password: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  private async isPasswordValide({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    const isPasswordValide = await bcrypt.compare(password, hashedPassword);
    return isPasswordValide;
  }
}
