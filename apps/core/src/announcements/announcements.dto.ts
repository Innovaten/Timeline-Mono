import { IsBoolean, IsString } from "class-validator";

export class createAnnouncementDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsBoolean()
    isDraft: boolean

    @IsString()
    class: string;

    @IsString()
    authToken: string;
}

export class updateAnnouncementDto {
    @IsString()
    title: string;
    
    @IsString()
    content: string;
    
    @IsBoolean()
    isDraft: boolean

    @IsString()
    class: string;
    
    @IsString()
    authToken: string;
}