import { Controller, Post, Body, Get, Request, UseGuards, Query, Param } from '@nestjs/common';
import { RegistrationDTO } from './registrations.dto';
import { RegistrationsService } from './registrations.service';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { IRegistrationDoc } from '@repo/models';
import { AuthGuard } from '../common/guards/jwt.guard';


@Controller({
    path: 'registrations',
    version: "1"
})

export class RegistrationsController {

    constructor(
        private service: RegistrationsService, 
    ) { }
    
    @UseGuards(AuthGuard)
    @Get()
    async getRegistrations(
        @Query('limit') rawLimit: string,
        @Query('offset') rawOffset: string,
        @Query('filter') rawfilter: string,
    ){

        let filter = rawfilter ? JSON.parse(rawfilter) : {}
        let limit;
        let offset;

        if(rawLimit){
            limit = parseInt(rawLimit);
        }

        if(rawOffset){
            offset = parseInt(rawOffset)
        } 

        try{
            const registrations = await this.service.getRegistrations(limit, offset, filter)

            return ServerSuccessResponse<IRegistrationDoc[]>(registrations);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        }

        
    }

    @UseGuards(AuthGuard)
    @Get('approve')
    async approveRegistration(
        @Query('_id') regId: string, 
        @Query('approved-classes') rawApprovedClasses: string,
        @Request() req: Request, 
    ){
        // @ts-ignore
        const approver = req["user"]
        if(!approver){
            return ServerErrorResponse(
                new Error("Unauthenticated Request"),
                403
            )    
        }

        if(!rawApprovedClasses){
            return ServerErrorResponse(
                new Error("Approved classes not specified"),
                400,
            )
        }

        const approvedClasses: Array<string> = JSON.parse(rawApprovedClasses);


        return await this.service.approveRegistration(regId, approvedClasses, approver);
    }

    @UseGuards(AuthGuard)
    @Get('reject')
    async rejectRegistration(
        @Query('_id') regId: string, 
        @Request() req: Request, 
    ){
        // @ts-ignore
        const rejector = req["user"]
        if(!rejector){
            return ServerErrorResponse(
                new Error("Unauthenticated Request"),
                403
            )    
        }

        return await this.service.rejectRegistration(regId, rejector);
    }

    @Post()
    async createNewStudent(
        @Body() regData: RegistrationDTO
    ){
        return await this.service.createNewRegistration(regData);
    }

    @Get(':_id')
    async getRegistrationByUser(
        @Param('_id') regId: string
    ){
        const registrant = await this.service.getRegistration(regId);
        if(!registrant){
            return ServerErrorResponse(
                new Error("Registrant not found"),
                404
            )
        }
        return registrant;
    }

    @Get('accept')
    async acceptRegistration(
        @Query('_id') regId: string, 
    ){
        return await this.service.approveAdmission(regId);
    }

    @Get('deny')
    async denyRegistration(
        @Query('_id') regId: string, 
    ){
        return await this.service.denyAdmission(regId);
    }

    @UseGuards(AuthGuard)
    @Get('students/count')
    async getStudentsCount( ){
        try{
            const student_count = await this.service.getStudentsCount()

            return ServerSuccessResponse<number>(student_count);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        }
    }

    @Get('pending/count')
    async getPendingCount( ){
        try{
            const pending_count = await this.service.getPendingCount()

            return ServerSuccessResponse<number>(pending_count);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } }

}
