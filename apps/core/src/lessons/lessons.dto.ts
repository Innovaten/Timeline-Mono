import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly moduleCode: string;

    @IsString()
    readonly content: string;

    @IsString()
    readonly authToken: string;

    @IsArray()
    readonly resources: string[];
}

export class UpdateLessonDto {
    @IsString()
    readonly title?: string;

    @IsString()
    readonly content?: string;

    @IsArray()
    readonly resources?: string[];
    
    @IsString()
    readonly authToken: string;

    
}
