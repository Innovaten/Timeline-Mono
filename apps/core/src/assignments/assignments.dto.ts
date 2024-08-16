import { IsArray, IsBoolean, IsDate, IsNumber, IsString } from "class-validator";


export class CreateAssigmentDto {

    @IsString()
    title: string;

    @IsString()
    instructions: string;
    
    @IsNumber()
    maxScore: number;
    
    @IsBoolean()
    isDraft: boolean;

    @IsDate()
    startDate: Date;
    
    @IsDate()
    endDate: Date;


    @IsArray()
    resources: string[];

    @IsArray()
    accessList: string[];

    @IsString()
    authToken: string;

}

export class UpdateAssignmentDto{
    @IsString()
    title?: string;

    @IsString()
    instructions?: string;
    
    @IsNumber()
    maxScore?: number;

    @IsDate()
    startDate?: Date;
    
    @IsDate()
    endDate?: Date;

    @IsArray()
    resources?: string[];

    @IsArray()
    accessList?: string[];

    @IsString()
    authToken?: string;
    
}

export class CreateSubmissionDto {
    @IsArray()
    resources: Array<string>;

    @IsString()
    authToken?: string;
}

export class GradeSubmissionDto {

    @IsString()
    feedback?: string;

    @IsNumber()
    score: number;

}