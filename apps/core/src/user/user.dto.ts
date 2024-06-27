import { IsEmail, IsString, IsPhoneNumber, IsEnum, IsOptional } from "class-validator";

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

export class UpdateUserDto {
    @IsString()
    _id: string

    @IsString()
    @IsOptional()
    firstName?: string

    @IsString()
    @IsOptional()
    lastName?: string

    @IsString()
    @IsOptional()
    phone?: string

    @IsEmail()
    @IsOptional()
    email?: string

    @IsString()
    @IsOptional()
    gender?: string
}