import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ChatService } from './chat.service';
import { Types } from 'mongoose';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  getChatHistory(
    @Param('userId') userId: string,
    @Req() req: any,
  ) {
    return this.chatService.getChatHistory(
      new Types.ObjectId(req.user.sub),
      userId,
    );
  }
}