import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthFactoryService } from './factory';
import { UserRepository } from 'src/models/user/user.repository';
import { User, UserSchema } from 'src/models/user/user.schema';
import { MailService } from '../mail/mail.service';
import { GoogleStrategy } from './stratigies/google.strategy';
import { OtpCleanupTask } from './tasks/otp-cleanup.task';
import { JwtStrategy } from './stratigies/jwt.strategy';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule, // ✅ required for AuthGuard('google') to work
    JwtModule.register({}), // ✅ replaces standalone JwtService provider
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthFactoryService,
    UserRepository,
    MailService,
    JwtService,
    JwtStrategy,
    GoogleStrategy, // ✅ this was the actual missing piece causing your error
    OtpCleanupTask,
  ],
})
export class AuthModule {}