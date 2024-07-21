import { IsString, IsNotEmpty, IsArray, IsBoolean, IsMongoId } from 'class-validator';

export class CreateModuleDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsArray()
    @IsMongoId({ each: true })
    readonly lessonSet: string[];

    @IsBoolean()
    readonly isDone: boolean;

    @IsString()
    @IsNotEmpty()
    readonly url: string;

    @IsMongoId()
    @IsNotEmpty()
    readonly class: string;
}

export class UpdateModuleDto {
    @IsString()
    readonly title?: string;

    @IsArray()
    @IsMongoId({ each: true })
    readonly lessonSet?: string[];

    @IsBoolean()
    readonly isDone?: boolean;

    @IsString()
    readonly url?: string;

    @IsMongoId()
    readonly class?: string;
}
