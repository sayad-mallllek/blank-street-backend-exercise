import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from 'src/common/config/jwt.config';
import { DatabaseService } from 'src/integrations/database/database.service';
import { comparePasswords, hashPassword } from 'src/utils/auth.utils';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly database: DatabaseService,
  ) {}

  private async generateAccessAndRefreshToken(email: string, id: number) {
    const payload = { email, id };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: JwtConfig.accessExpiresIn,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: JwtConfig.refreshExpiresIn,
      }),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.database.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return this.generateAccessAndRefreshToken(user.email, user.id);
  }

  async signup(signupDto: SignupDto) {
    const { email, name, password } = signupDto;

    const checkUserExists = await this.database.user.findFirst({
      where: { email: email },
    });

    if (checkUserExists) throw new ConflictException('User already exists');

    const hashedPassword = await hashPassword(password);

    const user = await this.database.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return this.generateAccessAndRefreshToken(user.email, user.id);
  }

  // TODO: If I have time, I'll implement the validate signup, reset password, and refresh token functionality.
}
