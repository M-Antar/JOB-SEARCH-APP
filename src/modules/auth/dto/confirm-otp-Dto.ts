import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class ConfirmOtp {

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @Length(6, 6)
    @IsNotEmpty()
    otp!: string;
}
