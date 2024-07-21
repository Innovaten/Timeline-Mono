import { IsString, IsNotEmpty, IsArray, IsBoolean, IsMongoId } from 'class-validator';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly content: string;

    @IsArray()
    @IsMongoId({ each: true })
    readonly resources: string[];

    @IsMongoId()
    @IsNotEmpty()
    readonly lessonSet: string;

    @IsBoolean()
    readonly isDone: boolean;
}

export class UpdateLessonDto {
    @IsString()
    readonly title?: string;

    @IsString()
    readonly content?: string;

    @IsArray()
    @IsMongoId({ each: true })
    readonly resources?: string[];

    @IsMongoId()
    readonly lessonSet?: string;

    @IsBoolean()
    readonly isDone?: boolean;
}
