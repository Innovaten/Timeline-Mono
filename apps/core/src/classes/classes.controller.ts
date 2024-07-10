import { Body, Controller, Get, Query, Post, Request, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { IClassDoc, } from '@repo/models';
import { AuthGuard } from '../common/guards/jwt.guard';
import { CreateClassDto, DeleteClassDto, UpdateClassDto } from './classes.dto';
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
        try {
            let filter = rawFilter ? JSON.parse(rawFilter) : {}
            let limit;
            let offset;
    
            if(rawLimit){
                limit = parseInt(rawLimit);
            }
    
            if(rawOffset){
                offset = parseInt(rawOffset)
            } 

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
        try {
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
            const newClass = await this.service.createClass(classData, `${creator._id}`);
            console.log("Created class", newClass.code);
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
        
        try {
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

            const updatedClass = await this.service.assignAdministrator(classId, adminId);
            console.log("Assigned administrator", adminId, "to", classId);
            return ServerSuccessResponse(updatedClass);

        } catch (err) {
            return ServerErrorResponse(
                new Error(`${err}`),
                500
            );
        }
    }

    @Patch(":_id")
    async updateClass(
        @Param("_id") _id: string,
        @Body() updatedData: UpdateClassDto,
    ){   
        try {
            if(!updatedData.authToken){
                return ServerErrorResponse(
                    new Error("Unauthenticated"),
                    401
                );
            }
    
            const updator = await this.jwt.validateToken(updatedData.authToken);
    
            if(!updator){
                return ServerErrorResponse(
                    new Error("Unauthenticated actor"),
                    401
                );
            }
    
            if(!["SUDO", "ADMINISTRATOR"].includes(updator.role)){
                return ServerErrorResponse(
                    new Error("Unauthorized"),
                    403
                );
            }
            const updatedClass = await this.service.updateClass(_id, updatedData, `${updator._id}`);
            if(!updatedClass){
                throw new Error("Specified class could not be found.")
            }
            console.log("Updated class", updatedClass._id);
            return ServerSuccessResponse(updatedClass);

        } catch (err){
            console.log(err);
            return ServerErrorResponse(new Error(`${err}`), 500);
        }
    }

    @Delete(":_id")
    async deleteClass(
        @Param("_id") _id: string,
        @Body() deleteClassDto: DeleteClassDto,
    ) {
      
        try {
            if(!deleteClassDto.authToken){
                return ServerErrorResponse(new Error("Unauthenticated Request"), 401)
            }
    
            const actor = await this.jwt.validateToken(deleteClassDto.authToken);
    
            if(!actor){
                return ServerErrorResponse(new Error("Unauthenticated Request"), 401)
            }
    
            if (actor.role !== 'SUDO') {
                return ServerErrorResponse(new Error("Unauthorized Request"), 401)
            }
            const deletedClass = await this.service.deleteClass(_id, `${actor}`);
            console.log("Deleted class", deletedClass._id);
            return ServerSuccessResponse(deletedClass);

        } catch (err) {
            return ServerErrorResponse(
                new Error(`${err}`), 
                500
            )
        }
    }

    @Get('count')
    async getClassesCount(
        @Query('filter') rawFilter: string
    ){
        try{
            const filter = rawFilter ? JSON.parse(rawFilter) : {};
            const classes_count = await this.service.getClassesCount(filter)
            return ServerSuccessResponse<number>(classes_count);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        }

        
    }
}
