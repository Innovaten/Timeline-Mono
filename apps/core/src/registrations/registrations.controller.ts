import { Controller, Post, Body, Get, Request, UseGuards, Query, Param } from '@nestjs/common';
import { RegistrationDTO } from './registrations.dto';
import { RegistrationsService } from './registrations.service';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { IRegistrationDoc } from '@repo/models';
import { AuthGuard } from '../common/guards/jwt.guard';
import { Types } from 'mongoose';


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
        try {
            let filter = rawfilter ? JSON.parse(rawfilter) : {}
            let limit;
            let offset;

            if(rawLimit){
                limit = parseInt(rawLimit);
            }

            if(rawOffset){
                offset = parseInt(rawOffset)
            } 

            const registrations = await this.service.getRegistrations(limit, offset, filter)
            const count = await this.service.getCount(filter);

            return ServerSuccessResponse({
                registrations,
                count
            });

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
        try {
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
            
        } catch (err) {
            console.log(err)
            return ServerErrorResponse(
                new Error(`${err}`), 
                500
            )
        }
    }

    @UseGuards(AuthGuard)
    @Get('reject')
    async rejectRegistration(
        @Query('_id') regId: string, 
        @Request() req: Request, 
    ){
        try {
            // @ts-ignore
            const rejector = req["user"]
            if(!rejector){
                    return ServerErrorResponse(
                    new Error("Unauthenticated Request"),
                    403
                )    
            }
            return await this.service.rejectRegistration(regId, rejector);
        } catch (err) {
            console.log(err)
            return ServerErrorResponse(
                new Error(`${err}`), 
                500
            )
        }
    }

    @Post()
    async createNewStudent(
        @Body() regData: RegistrationDTO
    ){
        try {
            return await this.service.createNewRegistration(regData);
        } catch (err) {
            console.log(err)
            return ServerErrorResponse(
                new Error(`${err}`), 
                500
            )
        }        
    }

    
    @Get('accept')
    async acceptRegistration(
        @Query('_id') regId: string, 
    ){
        try{
            return await this.service.acceptAdmission(regId);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }
        
    

    @Get('deny')
    async denyRegistration(
        @Query('_id') regId: string, 
    ){
        try{
            return await this.service.denyAdmission(regId);
        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }
       


    @UseGuards(AuthGuard)
    @Get('count')
    async getRegistrationsCount(
        @Query('filter') rawFilter: string
    ){
        try{
            const filter = rawFilter ? JSON.parse(rawFilter) : {};
            const count = await this.service.getCount(filter)
            return ServerSuccessResponse(count);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }
    
    @Get(':_id')
    async getRegistrationByUser(
        @Param('_id') regId: Types.ObjectId
    ){
        try {
            const registrant = await this.service.getRegistration(regId);
            if(!registrant){
                return ServerErrorResponse(
                    new Error("Registrant not found"),
                    404
                )
            }
            return registrant;
        } catch (err) {
            console.log(err)
            return ServerErrorResponse(
                new Error(`${err}`), 
                500
            )
        }
    }
}
