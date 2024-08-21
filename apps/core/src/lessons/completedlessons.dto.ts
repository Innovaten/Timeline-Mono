import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateCompletedLessonDto {
    @IsMongoId()
    @IsNotEmpty()
    readonly user: string;

    @IsMongoId({ each: true })
    readonly lesson: string;

    @IsString()
    readonly authToken: string
}

export class UpdateCompletedLessonDto {
    @IsMongoId()
    readonly user?: string;

    @IsMongoId({ each: true })
    readonly lesson?: string;

    @IsString()
    readonly authToken: string
}
