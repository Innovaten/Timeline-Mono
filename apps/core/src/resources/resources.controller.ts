import { Controller, Get, UseGuards } from '@nestjs/common';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { AuthGuard } from '../common/guards/jwt.guard';
import { ResourcesService } from './resources.service';


@Controller({ 
    path: 'resources',
    version: '1'
})

export class ResourcesController {
    constructor(
        private service: ResourcesService, 
    ) { }


    @UseGuards(AuthGuard)
    @Get('classes/count')
    async getClassesCount( ){

        try{
            const classes_count = await this.service.getClassesCount()

            return ServerSuccessResponse<number>(classes_count);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        }

        
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

    @UseGuards(AuthGuard)
    @Get('admins/count')
    async getAdminCount( ){
        try{
            const admin_count = await this.service.getAdminCount()

            return ServerSuccessResponse<number>(admin_count);

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
