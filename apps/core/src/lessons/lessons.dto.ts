import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    readonly moduleCode: string;

    @IsString()
    @IsNotEmpty()
    readonly content: string;

    @IsString()
    readonly authToken: string
}

export class UpdateLessonDto {
    @IsString()
    readonly title?: string;

    @IsString()
    readonly content?: string;

    @IsString()
    readonly authToken: string
}
