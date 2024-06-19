import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from '../common/services/user.service';
import { RegistrationDTO } from './registrations.dto';
import { RegistrationsService } from './registrations.service';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { IRegistrationDoc } from '@repo/models';

@Controller({
    path: 'registrations',
    version: "1"
})

export class RegistrationsController {

    constructor(
        private user: UserService,
        private service: RegistrationsService
    ) { }
    
    @Get()
    async getRegistration(
        @Param('limit') rawLimit: string,
        @Param('offset') rawOffset: string,
        @Param('filter') rawfilter: string,
    ){

        let filter = rawfilter ? JSON.parse(rawfilter) : {}
        let limit;
        let offset;

        if(rawLimit){
            parseInt(rawLimit);
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


    @Post()
    async createNewStudent(
        @Body() regData: RegistrationDTO
    ){
        return await this.user.createNewRegistration(regData);
    }


}
