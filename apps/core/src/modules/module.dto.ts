import { IsString, IsNotEmpty, IsArray, IsBoolean, IsMongoId } from 'class-validator';

export class CreateModuleDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly classCode: string;

    @IsString()
    authToken: string;
}

export class UpdateModuleDto {
    @IsString()
    readonly title?: string;

    @IsMongoId()
    readonly classCode?: string;

    @IsString()
    authToken: string;
}