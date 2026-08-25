import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepository } from "../abstract.repository";
import { User } from "./user.schema";
import { Model } from "mongoose";


export class UserRepository extends AbstractRepository<User>{
    constructor(@InjectModel(User.name) userModel:Model<User>){
        super(userModel);
    }
}