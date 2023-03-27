import { IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class SendgridDto {
    @IsString()
    @MinLength(1)
    @MaxLength(70)
    subject:string;
    @IsEmail()
    from:string;
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    text:string
    @IsPhoneNumber("CL")
    phone:string;
}
