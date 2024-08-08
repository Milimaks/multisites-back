import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LogUserDto } from './dto/log-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // This function is used to sign in the user.
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

  // This function is used to sign up the user.
  async signUp({ authBody }: { authBody: CreateUserDto }) {
    const { email, password, firstName } = authBody;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }
    const hashedPassword = await this.hashPassword({ password });

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
      },
    });

    return this.authenticateUser({ userId: createdUser.id });
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
