import {
  IsEmail,
  IsString,
  IsStrongPassword,
  IsNotEmpty,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
