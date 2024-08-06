import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LogUserDto {
  @IsString({ message: 'Invalid firstname' })
  firstname: string;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password need at least 6 characters' })
  password: string;
}
