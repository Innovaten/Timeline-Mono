import { IsString, IsNotEmpty, IsArray, IsMongoId } from 'class-validator';

export class CreateCompletedLessonDto {
    @IsMongoId()
    @IsNotEmpty()
    readonly user: string;

    @IsArray()
    @IsMongoId({ each: true })
    readonly lessons: string[];
}

export class UpdateCompletedLessonDto {
    @IsMongoId()
    readonly user?: string;

    @IsArray()
    @IsMongoId({ each: true })
    readonly lessons?: string[];
}
