import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/common/config/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: JwtConfig.accessExpiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
