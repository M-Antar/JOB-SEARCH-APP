import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepository } from "../abstract.repository";
import { Company } from "./company.schema";
import { Model } from "mongoose";


export class CompanyRepository extends AbstractRepository<Company>{
    constructor(@InjectModel(Company.name) companyModel:Model<Company>){
        super(companyModel)
    }
}