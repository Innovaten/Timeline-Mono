import { IsString, IsEnum, IsOptional } from "class-validator";

enum ModeOfClass {
    "In-Person",
    "Online"
}

export class CreateClassDto {
    @IsString()
    name: string;

    @IsEnum(ModeOfClass)
    modeOfClass: string;

    @IsString()
    authToken: string;
}



export class UpdateClassDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsEnum(ModeOfClass)
    @IsOptional()
    modeOfClass: string;

    @IsString()
    authToken: string;
}

export class DeleteClassDto {
    @IsString()
    authToken: string;
}