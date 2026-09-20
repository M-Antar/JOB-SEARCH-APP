
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';

import { ChatService } from 'src/modules/chat/chat.service';
import { SendMessageDto } from 'src/modules/chat/dto/send-message-Dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(
    NotificationsGateway.name,
  );

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(
          `Socket ${client.id} connected without a token`,
        );

        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      client.join(`user:${payload.sub}`);

      this.logger.log(
        `Socket ${client.id} joined room user:${payload.sub}`,
      );
    } catch (err) {
      this.logger.warn(
        `Socket ${client.id} failed auth: ${err.message}`,
      );

      client.disconnect();
    }
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto | string,
  ) {
    this.logger.log('SEND-MESSAGE EVENT RECEIVED');
    this.logger.log(`DATA: ${JSON.stringify(data)}`);

    let messageData: SendMessageDto;

    if (typeof data === 'string') {
      try {
        messageData = JSON.parse(data);
      } catch {
        throw new BadRequestException(
          'Invalid message payload',
        );
      }
    } else {
      messageData = data;
    }

    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      client.disconnect();
      return;
    }

    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });

    const senderId = new Types.ObjectId(payload.sub);

    const chat = await this.chatService.sendMessage(
      senderId,
      messageData,
    );

    const message =
      chat.messages[chat.messages.length - 1];

    this.logger.log(
      `MESSAGE SAVED - chatId: ${chat._id}`,
    );

    this.server
      .to(`user:${messageData.receiverId}`)
      .emit('new-message', {
        chatId: chat._id,
        senderId: message.senderId,
        message: message.message,
        createdAt: new Date(),
      });

    return {
      success: true,
      chat,
    };
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      `Socket ${client.id} disconnected`,
    );
  }

  notifyNewApplication(
    userIds: string[],
    payload: any,
  ) {
    this.logger.log(
      'SOCKET - notifyNewApplication called',
    );

    userIds.forEach((userId) => {
      this.server
        .to(`user:${userId}`)
        .emit('new-application', payload);
    });

    this.logger.log(
      'SOCKET - notifyNewApplication finished',
    );
  }
}
