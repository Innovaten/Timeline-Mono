import { IsString, IsNotEmpty, IsArray, IsBoolean, IsMongoId } from 'class-validator';

export class CreateModuleDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly classCode: string;

    @IsString()
    authToken: string;

    @IsArray()
    readonly resources: string[];
}

export class UpdateModuleDto {
    @IsString()
    readonly title?: string;

    @IsMongoId()
    readonly classCode?: string;
    @IsArray()
    readonly resources?: string[];
    @IsString()
    authToken: string;

    
}