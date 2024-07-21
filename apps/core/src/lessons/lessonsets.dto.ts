// lessonsets.dto.ts
import { IsString, IsNotEmpty, IsArray, IsMongoId, IsNumber } from 'class-validator';

export class CreateLessonSetDto {
    @IsMongoId()
    @IsNotEmpty()
    readonly class: string;

    @IsNumber()
    @IsNotEmpty()
    readonly totalLessons: number;

    @IsArray()
    @IsMongoId({ each: true })
    readonly lessons: string[];
}

export class UpdateLessonSetDto {
    @IsMongoId()
    readonly class?: string;

    @IsNumber()
    readonly totalLessons?: number;

    @IsArray()
    @IsMongoId({ each: true })
    readonly lessons?: string[];
}
