import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SearchWithNameDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    
    companyName!: string;
}

