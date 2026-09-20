import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { Chat, ChatSchema } from 'src/models/chat/chat.schema';
import { ChatRepository } from 'src/models/chat/chat.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
    ]),
    CompanyModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatRepository, ChatService],
  exports: [ChatService],
})
export class ChatModule {}