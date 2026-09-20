import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: true })
export class Message {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  message!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  senderId!: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  senderId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  receiverId!: Types.ObjectId;

  @Prop({
    type: [Message],
    default: [],
  })
  messages!: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);