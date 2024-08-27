import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LogUserDto } from './dto/log-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { MailerService } from 'src/mailer.service';
import { createId } from '@paralleldrive/cuid2';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  // This function is used to sign in the user.
  async signIn({ authBody }: { authBody: LogUserDto }) {
    try {
      const { email, password } = authBody;

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new Error("L'utilisateur n'existe pas.");
      }

      const isPasswordValid = await this.isPasswordValid({
        password,
        hashedPassword: existingUser.password,
      });

      if (!isPasswordValid) {
        throw new Error('Le mot de passe est invalide.');
      }
      return this.authenticateUser({
        userId: existingUser.id,
      });
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  // This function is used to sign in the user.
  async sendRequestToChangePassword({ email }: { email: string }) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new Error("L'utilisateur n'existe pas.");
      }

      if (existingUser.IsResettingPassword === true) {
        throw new Error(
          'Un email a déjà été envoyé pour réinitialiser votre mot de passe.',
        );
      }

      const ResetToken = await createId();

      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          ResetPasswordToken: ResetToken,
          IsResettingPassword: true,
        },
      });

      this.mailerService.sendModificatePasswordEmail({
        ResetToken,
        recipient: existingUser.email,
        firstName: existingUser.firstName,
      });

      return {
        error: false,
        message: 'Un email a été envoyé pour réinitialiser votre mot de passe.',
      };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  // This function is used to sign up the user.
  async signUp({ registerBody }: { registerBody: CreateUserDto }) {
    try {
      const { email, firstName, password } = registerBody;

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUser) {
        throw new Error('Un compte existe déjà à cette adresse email.');
      }
      const hashedPassword = await this.hashPassword({ password });

      const createdUser = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
        },
      });

      // Send an email to the user when the account is created.
      await this.mailerService.sendCreatedAccountEmail({
        firstName,
        recipient: email,
      });

      return this.authenticateUser({
        userId: createdUser.id,
      });
    } catch (error) {
      return {
        error: true,
        message: error.message,
      };
    }
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
  async verifyResetPasswordToken({ token }: { token: string }) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          ResetPasswordToken: token,
        },
      });

      if (!existingUser) {
        throw new Error("L'utilisateur n'existe pas.");
      }

      if (existingUser.IsResettingPassword === false) {
        throw new Error(
          "Aucune demande de réinitialisation de mot de passe n'est en cours.",
        );
      }

      return {
        error: false,
        message: 'Le token est valide et peut être utilisé.',
      };
      // return this.authenticateUser({
      //   userId: existingUser.id,
      // });
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async resetUserPassword({
    resetPasswordDto,
  }: {
    resetPasswordDto: ResetUserPasswordDto;
  }) {
    try {
      const { password, token } = resetPasswordDto;
      const existingUser = await this.prisma.user.findUnique({
        where: {
          ResetPasswordToken: token,
        },
      });

      if (!existingUser) {
        throw new Error("L'utilisateur n'existe pas.");
      }

      if (existingUser.IsResettingPassword === false) {
        throw new Error(
          "Aucune demande de réinitialisation de mot de passe n'est en cours.",
        );
      }

      const hashedPassword = await this.hashPassword({
        password,
      });
      await this.prisma.user.update({
        where: {
          ResetPasswordToken: token,
        },
        data: {
          IsResettingPassword: false,
          ResetPasswordToken: null,
          password: hashedPassword,
        },
      });

      return {
        error: false,
        message: 'Votre mot de passe a bien été changé.',
      };
      // return this.authenticateUser({
      //   userId: existingUser.id,
      // });
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
