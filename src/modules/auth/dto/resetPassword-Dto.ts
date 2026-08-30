import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class ResetPasswordDto {

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    
    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    otp!:string;

    @IsString()
    @IsNotEmpty()
    newPassword!: string;

}