import { IsString } from "class-validator";

export class AssignAdminDTO {
    @IsString()
    classId: string

    @IsString()
    administratorId: string
}