import { IsString, IsNotEmpty, IsArray, IsMongoId, IsNumber } from 'class-validator';

export class CreateLessonSetDto {
    @IsMongoId()
    @IsNotEmpty()
    readonly class: string;

    @IsMongoId()
    @IsNotEmpty()
    readonly module: string

    @IsArray()
    @IsMongoId({ each: true })
    readonly lessons: string[];

    @IsString()
    @IsNotEmpty()
    readonly title: string

    @IsString()
    authToken: string;
}

export class UpdateLessonSetDto {
    @IsMongoId()
    readonly class?: string;

    @IsMongoId()
    @IsNotEmpty()
    readonly module?: string


    @IsString()
    authToken: string
}

export class DeleteLessonSetDto {
    @IsString()
    authToken: string;
}
