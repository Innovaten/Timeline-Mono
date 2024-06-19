import { IsArray, IsEmail, IsString } from "class-validator";

export class UserRegistrationDTO {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;
    
    @IsString()
    gender: string;

    @IsString()
    modeOfClass: string;

    @IsString()
    otherNames: string;
    
    @IsString()
    phone: string;

    @IsArray()
    courses: Array<string>;
}