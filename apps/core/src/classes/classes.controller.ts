import { Body, Controller, Get, Query, Post, Request, UseGuards } from '@nestjs/common';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { IClassDoc, } from '@repo/models';
import { AuthGuard } from '../common/guards/jwt.guard';
import { CreateClassDto } from './classes.dto';
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

    @UseGuards(AuthGuard)
    @Get('assign-administrator')
    async assignAdministrator(
        @Query('adminId') adminId: string,
        @Query('classId') classId: string,
        @Request() req: any
    ) {
        const user = req["user"];
        
        if (!user) {
            return ServerErrorResponse(
                new Error("Unauthenticated"),
                401
            );
        }

        if (user.role !== 'SUDO') {
            return ServerErrorResponse(
                new Error("Unauthorized"),
                401
            );
        }

        try {
            const updatedClass = await this.service.assignAdministrator(classId, adminId);
            return ServerSuccessResponse(updatedClass);
        } catch (err) {
            return ServerErrorResponse(
                new Error(`${err}`),
                500
            );
        }
    }
}
