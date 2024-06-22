import { IsString, IsEnum } from "class-validator";

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