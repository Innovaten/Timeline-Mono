import { Body, Controller, Get, Query, Post, Request, UseGuards } from '@nestjs/common';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { IClassDoc, } from '@repo/models';
import { AuthGuard } from '../common/guards/jwt.guard';
import { CreateClassDto, AssignAdminDTO } from './classes.dto';
import { JwtService } from '../common/services/jwt.service';
import { ClassesService } from './classes.service';

@Controller({
    path: 'classes',
    version: '1',
})

export class ClassesController {

    constructor ( 
        private service: ClassesService,
        private jwt: JwtService,
     ) { }

    @UseGuards(AuthGuard)
    @Get()
    async getAllCLasses(
        @Query('limit') rawLimit: string,
        @Query('offset') rawOffset: string,
        @Query('filter') rawFilter: string,
    ){

        let filter = rawFilter ? JSON.parse(rawFilter) : {}
        let limit;
        let offset;

        if(rawLimit){
            limit = parseInt(rawLimit);
        }

        if(rawOffset){
            offset = parseInt(rawOffset)
        } 

        try {
            const classes = await this.service.getClasses(limit, offset, filter)
            const count = await this.service.getCount(filter);
    
            return ServerSuccessResponse<{ classes: IClassDoc[], count: number}>({
                classes,
                count,
            })

        } catch (err) {
            return ServerErrorResponse(
                new Error(`${err}`),
                500
            )
        }
    }

    @Post()
    async createClass(
        @Body() classData: CreateClassDto,
        @Request() req: Request
    
    ) {

        const creator = await this.jwt.validateToken(classData.authToken);

        if(!creator){
            return ServerErrorResponse(
                new Error("Unauthenticated"),
                401
            )
        }

        if(creator.role != 'SUDO'){
            return ServerErrorResponse(
                new Error("Unauthorized"),
                401
            )
        }

        try {
            const newClass = await this.service.createClass(classData, `${creator._id}`);
            return ServerSuccessResponse(newClass);
        } catch(err) {
            return ServerErrorResponse(
                new Error(`${err}`),
                500
            )
        }

    }

    @Post('assign-administrator')
    async assignAdministrator(
        @Body() assignAdminDTO: AssignAdminDTO,
    ) {
        try {
            const result = await this.service.assignAdministrator(assignAdminDTO.classId, assignAdminDTO.administratorId)
            return ServerSuccessResponse(result)
        } catch(err) {
            return ServerErrorResponse(new Error(`{err}`), 500)
        }
    }

}
