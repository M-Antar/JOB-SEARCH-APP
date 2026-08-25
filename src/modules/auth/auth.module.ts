import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthFactoryService } from './factory';
import { UserRepository } from 'src/models/user/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user/user.schema';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // registers the model
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthFactoryService,UserRepository,MailService,JwtService],
})
export class AuthModule {}
