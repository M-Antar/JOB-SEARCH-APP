import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository";
import { Application } from "./application";


export class ApplicationRepository extends AbstractRepository<Application> {
  constructor(
    @InjectModel(Application.name)
    applicationModel: Model<Application>,
  ) {
    super(applicationModel);
  }
}