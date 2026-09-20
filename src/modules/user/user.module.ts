import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { UserRepository } from 'src/models/user/user.repository';
import { User, UserSchema } from 'src/models/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({}),
  ],

  controllers: [UserController],

  providers: [
    UserService,
    UserRepository,
    JwtService,
  ],

  exports: [
    UserRepository,
  ],
})
export class UserModule {}