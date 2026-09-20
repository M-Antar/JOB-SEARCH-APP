import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository";
import { Chat } from "./chat.schema";


export class ChatRepository extends AbstractRepository<Chat> {
  constructor(
    @InjectModel(Chat.name)
    chatModel: Model<Chat>,
  ) {
    super(chatModel);
  }
}