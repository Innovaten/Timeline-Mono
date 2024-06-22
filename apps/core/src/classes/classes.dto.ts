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

export class AssignAdminDTO {
    @IsString()
    classId: string

    @IsString()
    administratorId: string
}