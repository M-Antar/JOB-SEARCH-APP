import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepository } from "../abstract.repository";
import { Job } from "./job.schema";
import { Model } from "mongoose";

export class JobRepository extends AbstractRepository<Job>{
    constructor(@InjectModel(Job.name) jobModel:Model<Job>){
        super(jobModel);
    }
}