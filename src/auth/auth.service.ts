import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LogUserDto } from './dto/log-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({ authBody }: { authBody: LogUserDto }) {
    const { email, password } = authBody;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      throw new Error('User not found');
    }

    const isPasswordValid = this.isPasswordValid({
      password,
      hashedPassword: existingUser.password,
    });
    if (!isPasswordValid || existingUser.email !== email) {
      throw new Error('Invalid password or email');
    }

    return this.authenticateUser({ userId: existingUser.id });
    // const hashedPassword = await this.hashPassword({ password });
  }

  // This function hashes the password using bcrypt.
  private async hashPassword({ password }: { password: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  // This function compares the password with the hashed password.
  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    const isPasswordValide = await bcrypt.compare(password, hashedPassword);
    return isPasswordValide;
  }

  // This function generates a JWT token for the user.
  private async authenticateUser({ userId }: UserPayload) {
    const payload: UserPayload = { userId };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
