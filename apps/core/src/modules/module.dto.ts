import { IsString, IsNotEmpty, IsArray, IsBoolean, IsMongoId } from 'class-validator';

export class CreateModuleDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsArray()
    @IsMongoId({ each: true })
    readonly lessonSet: string[];


    @IsNotEmpty()
    readonly classId: string;

    @IsString()
    authToken: string;
}

export class UpdateModuleDto {
    @IsString()
    readonly title?: string;

    @IsArray()
    @IsMongoId({ each: true })
    readonly lessonSet?: string[];

    @IsMongoId()
    readonly classId?: string;

    @IsString()
    authToken: string;
}

export class DeletModuleDto {
    @IsString()
    authToken: string;
}
