import { IsBoolean, IsString } from "class-validator";

export class CreateAnnouncementDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsBoolean()
    isDraft: boolean

    @IsString()
    classCode: string;

    @IsString()
    authToken: string;
}

export class UpdateAnnouncementDto {
    @IsString()
    title: string;
    
    @IsString()
    content: string;
    
    @IsBoolean()
    isDraft: boolean

    @IsString()
    classCode: string;
    
    @IsString()
    authToken: string;
}

export class DeleteAnnouncementDto {
    @IsString()
    authToken: string;

    @IsString()
    classCode: string;
}