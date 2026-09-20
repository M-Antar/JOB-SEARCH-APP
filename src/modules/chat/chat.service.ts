import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ChatRepository } from 'src/models/chat/chat.repository';
import { CompanyRepository } from 'src/models/company/company.repository';
import { UserRepository } from 'src/models/user/user.repository';
import { SendMessageDto } from './dto/send-message-Dto';
import { ROLE } from 'src/common/types';



@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getChatHistory(
    userId: Types.ObjectId,
    otherUserId: string,
  ) {
    if (!Types.ObjectId.isValid(otherUserId)) {
      throw new BadRequestException('Invalid user id');
    }

    const otherUserObjectId = new Types.ObjectId(otherUserId);

    const chat = await this.chatRepository.getOne({
      $or: [
        {
          senderId: userId,
          receiverId: otherUserObjectId,
        },
        {
          senderId: otherUserObjectId,
          receiverId: userId,
        },
      ],
    });

    if (!chat) {
      return {
        messages: [],
      };
    }

    return chat;
  }

  async sendMessage(
    senderId: Types.ObjectId,
    sendMessageDto: SendMessageDto,
  ) {
    const { receiverId, message } = sendMessageDto;

    if (!Types.ObjectId.isValid(receiverId)) {
      throw new BadRequestException('Invalid receiver id');
    }

    const receiverObjectId = new Types.ObjectId(receiverId);

    if (senderId.toString() === receiverObjectId.toString()) {
      throw new BadRequestException(
        'You cannot send a message to yourself',
      );
    }

    const receiver = await this.userRepository.getOne({
      _id: receiverObjectId,
    });

    if (!receiver) {
      throw new BadRequestException('Receiver not found');
    }

    let chat = await this.chatRepository.getOne({
      $or: [
        {
          senderId,
          receiverId: receiverObjectId,
        },
        {
          senderId: receiverObjectId,
          receiverId: senderId,
        },
      ],
    });

    /*
     * If the chat does not exist yet,
     * only company owner or HR can start it.
     */
    if (!chat) {
      const canStart = await this.canStartConversation(senderId);

      if (!canStart) {
        throw new ForbiddenException(
          'Only HR or company owner can start a conversation',
        );
      }

      /*
       * The first conversation must be started
       * with a regular user.
       */
      if (receiver.role !== ROLE.USER) {
        throw new ForbiddenException(
          'You can only start a conversation with a regular user',
        );
      }

      chat = await this.chatRepository.create({
        senderId,
        receiverId: receiverObjectId,
        messages: [
          {
            message,
            senderId,
          },
        ],
      });

      return chat;
    }

    /*
     * Chat already exists.
     * Either participant can send messages now.
     */
    const isParticipant =
      chat.senderId.toString() === senderId.toString() ||
      chat.receiverId.toString() === senderId.toString();

    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    chat.messages.push({
      message,
      senderId,
    });

    await chat.save();

    return chat;
  }

  private async canStartConversation(
    userId: Types.ObjectId,
  ): Promise<boolean> {
    const companies = await this.companyRepository.getAll({
      $or: [
        {
          createdBy: userId,
        },
        {
          HRs: userId,
        },
      ],
    });

    return companies.length > 0;
  }
}