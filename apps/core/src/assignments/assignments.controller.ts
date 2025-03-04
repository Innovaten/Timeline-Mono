import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { AssignmentsService } from './assignments.service';
import { AuthGuard } from '../common/guards/jwt.guard';
import { IUserDoc } from '@repo/models';
import { Roles } from '../common/enums/roles.enum';
import { CreateSubmissionDto, GradeSubmissionDto, UpdateAssignmentDto } from './assignments.dto';
import { JwtService } from '../common/services/jwt.service';

@Controller({
    path: 'assignments',
    version: "1",
})
export class AssignmentsController {

    constructor(
        private service: AssignmentsService,
        private jwt: JwtService,
    ){}


    @UseGuards(AuthGuard)
    @Get()
    async listAssignments(
        @Query('limit') rawLimit: string,
        @Query('offset') rawOffset: string,
        @Query('filter') rawFilter: string,
        @Req() req: any
    ){  
        try {

            const user = req.user as IUserDoc | null

            if(!user){
                throw new UnauthorizedException()
            }

            if(user.role != Roles.SUDO){
                throw new ForbiddenException()
            }

            let filter = rawFilter ? JSON.parse(rawFilter) : {}
            let limit;
            let offset;
    
            if(rawLimit){
                limit = parseInt(rawLimit);
            }
    
            if(rawOffset){
                offset = parseInt(rawOffset)
            } 

            const assignments = await this.service.getAssignments(limit, offset, filter)
            const count = await this.service.getCount(filter);

            return ServerSuccessResponse({
                assignments,
                count,
            })

        } catch (err) {
            return ServerErrorResponse(
                new Error(`${err}`),
                500
            )
        }
    }


    @UseGuards(AuthGuard)
    @Get(":specifier/publish")
    async publishAssignment(
        @Param('specifier') specifier: string,
        @Query('isId') isId: string,
        @Req() req: any
    ) {
        try {

            const user = req.user as IUserDoc | null

            if(!user){
                throw new UnauthorizedException()
            }
            
            const IsId = isId === "true";
            const assignment = await this.service.publishAssignment(specifier, IsId, user);

            return ServerSuccessResponse(assignment)
        
        } catch(err: any) {
            return ServerErrorResponse(
                new Error(`${ err.message ? err.message : err }`),
                500
            )

        }
    }

    @UseGuards(AuthGuard)
    @Get(':specifier/submissions')
    async listAssignmentSubmissionsByAssignment(
        @Param('specifier') specifier: string,
        @Query('isId') isId: string = "true",
        @Query('limit') rawLimit: string,
        @Query('offset') rawOffset: string,
        @Query('filter') rawFilter: string,
        @Req() req: any
    ){  
        try {

            const user = req.user as IUserDoc
            if(user.role == Roles.STUDENT){
                throw new ForbiddenException()
            }

            let filter = rawFilter ? JSON.parse(rawFilter) : {}
            let limit;
            let offset;
    
            if(rawLimit){
                limit = parseInt(rawLimit);
            }
    
            if(rawOffset){
                offset = parseInt(rawOffset)
            } 

            const assignmentSubmissions = await this.service.listAssignmentSubmissionsByAssignment(specifier, isId === "true", user, limit, offset, filter);
            const count = await this.service.getAssignmentSubmissionsCount(specifier, isId === "true", filter);

            return ServerSuccessResponse({
                assignmentSubmissions,
                count
            })

        } catch(err: any) {
            return ServerErrorResponse(
                new Error(`${ err.message ? err.message : err }`),
                500
            )

        }

    }

    @Post(':specifier/submissions')
    async createAssignmentSubmission(
        @Param('specifier') specifier: string,
        @Query('isId') isId: string = "true",
        @Body() submissionData: CreateSubmissionDto,
    ){  
        try {
            if(!submissionData.authToken){
                throw new UnauthorizedException()
            }

            const user = await this.jwt.validateToken(submissionData.authToken)

            if(!user){
                throw new UnauthorizedException();
            }

            if(user.role != Roles.STUDENT){
                throw new BadRequestException()
            }

            const submission = await this.service.createAssignmentSubmission(specifier, isId === "true", submissionData, user);

            return ServerSuccessResponse(submission)

        } catch(err: any) {
            return ServerErrorResponse(
                new Error(`${ err.message ? err.message : err }`),
                500
            )
        }
    }

    @UseGuards(AuthGuard)
    @Get(":assignmentSpecifier/submissions/:submissionSpecifier")
    async getAssignmentSubmission(
        @Param('assignmentSpecifier') assignmentSpecifier: string,
        @Param('submissionSpecifier') submissionSpecifier: string,
        @Query('isId') isId: string = "true",
        @Req() req: any,
    ) {
        try {
            const user = req.user
            const { submission, assignment} = await this.service.getAssignmentSubmission(assignmentSpecifier, submissionSpecifier, isId === "true", user);

            return ServerSuccessResponse({
                submission,
                assignment
            })

        } catch(err: any) {
            return ServerErrorResponse(
                new Error(`${err.message ? err.message : err}`),
                500
            )
        }
    }

    @UseGuards(AuthGuard)
    @Post(":assignmentSpecifier/submissions/:submissionSpecifier")
    async gradeAssignmentSubmission(
        @Param('assignmentSpecifier') assignmentSpecifier: string,
        @Param('submissionSpecifier') submissionSpecifier: string,
        @Query('isId') isId: string = "true",
        @Body() gradeData : GradeSubmissionDto,
        @Req() req: any,
    ) {
        try {
            const user = req.user
            const submission = await this.service.gradeAssignmentSubmission(assignmentSpecifier, submissionSpecifier, isId === "true", gradeData, user);

            return ServerSuccessResponse(submission)

        } catch(err: any) {
            return ServerErrorResponse(
                new Error(`${err.message ? err.message : err}`),
                500
            )
        }
    }




    @UseGuards(AuthGuard)
    @Get(":specifier")
    async getAssignment(
        @Param('specifier') specifier: string,
        @Query('isId') isId: string,
        @Req() req: any
    ) {
        try {

            const user = req.user as IUserDoc
            

            const IsId = isId === "true";
            const assignment = await this.service.getAssignment(specifier, IsId, user);

            if(!assignment){
                throw new NotFoundException()
            }

            return ServerSuccessResponse(assignment)
        
        } catch(err: any) {
            return ServerErrorResponse(
                new Error(`${ err.message ? err.message : err }`),
                500
            )

        }

    }

    @Patch(":_id")
    async updateAssignment(
        @Param("_id") _id: string,  
        @Body() updateData: UpdateAssignmentDto
    ) { 

        try {

            if(!updateData.authToken){
                throw new UnauthorizedException()
            }

            const user = await this.jwt.validateToken(updateData.authToken)

            if(!user){
                throw new UnauthorizedException();
            }

            const updatedAssignment =  await this.service.updateAssignment(_id, updateData, user);

            return ServerSuccessResponse(updatedAssignment)

        } catch(err: any) {
            return ServerErrorResponse(
                new Error(`${ err.message ? err.message : err }`),
                500
            )
        }

    }

    @UseGuards(AuthGuard)
    @Delete(":specifier")
    async deleteAssignment(
        @Param('specifier') specifier: string,
        @Req() req: any
    ) {

        try {
            
            const user = req.user as IUserDoc | null

            if(!user){
                throw new UnauthorizedException()
            }
            
            const assignment = await this.service.deleteAssignment(specifier, user);

            return ServerSuccessResponse(assignment)
        
        } catch(err: any) {
            return ServerErrorResponse(
                new Error(`${ err.message ? err.message : err }`),
                500
            )
        }
    }

}
