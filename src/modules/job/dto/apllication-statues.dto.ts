import { IsEnum, IsMongoId } from "class-validator";
import { APPLICATIONSTATUS } from "src/common/types";



export class AppChangeStatus {

    @IsMongoId()
    appID!: string;

    @IsEnum(APPLICATIONSTATUS)
    status!: string;
}