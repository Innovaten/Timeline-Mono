import { IsEmail, IsString, IsPhoneNumber, IsEnum } from "class-validator";

enum Role {
    "ADMIN",
    "SUDO"
}

export class CreateUserDto {
    @IsString()
    firstName: string;

    @IsString()
    otherNames: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;
    
    @IsPhoneNumber("GH")
    phone: string;

    @IsEnum(Role)
    role: string;

    @IsString()
    authToken: string;
}