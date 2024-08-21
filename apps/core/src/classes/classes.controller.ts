import { Body, Controller, Get, Query, Post, Request, UseGuards, Patch, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { ClassModel, IAnnouncementSetDoc, IClassDoc, IUserDoc, } from '@repo/models';
import { AuthGuard } from '../common/guards/jwt.guard';
import { CreateClassDto, DeleteClassDto, UpdateClassDto } from './classes.dto';
import { JwtService } from '../common/services/jwt.service';
import { ClassesService } from './classes.service';
import { Roles } from '../common/enums/roles.enum';
import { HydratedDocument, Types } from 'mongoose';
import { CreateAssigmentDto } from '../assignments/assignments.dto';


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

            const updatedClass = await this.service.assignAdministrator(classId, adminId, user._id);
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
    
            if(!["SUDO", "ADMIN"].includes(updator.role)){
                return ServerErrorResponse(
                    new Error("Unauthorized"),
                    403
                );
            }
            const updatedClass = await this.service.updateClass(_id, updatedData, `${updator._id}`);
            if(!updatedClass){
                throw new Error("Specified class could not be found.")
            }
            console.log("Updated class", updatedClass.code);
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

    @UseGuards(AuthGuard)
    @Get('count')
    async getClassesCount(
        @Query('filter') rawFilter: string,
        @Req() req: any,
    ){
        try{
           
            const user = req.user;
            if (user?.role === 'SUDO') {
            const filter = rawFilter ? JSON.parse(rawFilter) : {};
            const classes_count = await this.service.getClassesCount(filter)
            return ServerSuccessResponse<number>(classes_count);
            } else if (user?.role === 'ADMIN') {
                return ServerSuccessResponse<number>(user.classes.length); 
            } else {
                return ServerErrorResponse(
                    new Error("Unauthorized Request"),
                    401
                )
            }

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        }   
    }

    @UseGuards(AuthGuard)
    @Get(':specifier/announcements')
    async getAnnouncementsByClass(
        @Param('specifier') specifier: string,
        @Query('isId') isId: string = "true",
        @Request() req: Request,
    ) {
        try {
            // @ts-ignore
            const user = req["user"];

            const filter = isId === 'true' ?  { _id: new Types.ObjectId(specifier)} : { code: specifier };

            const relatedClass = await ClassModel.findOne(filter).populate<{ announcementSet: IAnnouncementSetDoc }>("announcementSet");

            if(!relatedClass){
                return ServerErrorResponse(
                    new Error("Specified class could not be found"),
                    404,
                )
            }

            if(
                user.role !== Roles.SUDO && 
                !user.classes.includes(relatedClass._id)
            ){
                return ServerErrorResponse(
                    new Error("You are not permitted to perform this action"),
                    403,
                )
            }

            const announcements = await this.service.getAnnouncementsByClass(`${relatedClass._id}`);
            
            return ServerSuccessResponse(announcements);
            
        } catch(err) {
            return ServerErrorResponse(
                new Error(`${err}`), 
                500
            );
        }  
    }

    @Get(':_id/modules')
    async getModulesByClassId(
        @Param('_id') _id: string, 
        @Request() req: any
    ) {
        try {
            const userRole = req.user.role
            return this.service.getModuleByClassId(_id, userRole)
        } catch (error) {
            return ServerErrorResponse(new Error(`${error}`), 500)
        }
    }

    @Post(":specifier/assignments")
    async createAssignment(
        @Param('specifier') specifier: string,
        @Query("isId") isId: string = "true", 
        @Body() assignmentData: CreateAssigmentDto
    ) {
        try {
            if(!assignmentData.authToken){
                throw new UnauthorizedException()
            }

            const user = await this.jwt.validateToken(assignmentData.authToken)

            if(!user){
                throw new UnauthorizedException();
            }

            const IsId = isId === "true"
            const newAssignment = await this.service.createAssignment(specifier, IsId, assignmentData, user);

            return ServerSuccessResponse(newAssignment);

        } catch (err: any) {
            return ServerErrorResponse(
                new Error(`${ err.message ? err.message : err}`),
                500
            )
        }
    }

    @UseGuards(AuthGuard)
    @Get(":specifier/assignments")
    async getClassAssignments( 
        @Param("specifier") specifier: string,
        @Query('isId') isId: string = "true",
        @Request() req: Request,
        @Query('limit') rawLimit: string,
        @Query('offset') rawOffset: string,
        @Query('filter') rawFilter: string,
    ) {

        try {
            // @ts-ignore
            const user = req["user"]

            let filter = rawFilter ? JSON.parse(rawFilter) : {}
            let limit;
            let offset;
    
            if(rawLimit){
                limit = parseInt(rawLimit);
            }
    
            if(rawOffset){
                offset = parseInt(rawOffset)
            } 
          
            const assignments = await this.service.getClassAssignments(limit, offset, filter, specifier, isId === "true", user)
            const count = await this.service.getClassAssignmentsCount(filter, specifier, isId === "true", user);

            return ServerSuccessResponse({
                assignments,
                count,
            })

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 

    }



    @UseGuards(AuthGuard)
    @Get(":specifier/students")
    async getStudentsInClass( 
        @Param("specifier") specifier: string,
        @Query('isId') isId: string = "true",
        @Request() req: Request,
    ) {

        try {
            // @ts-ignore
            const user = req["user"]
            
            const students = await this.service.getStudentsInClass(specifier, isId === "true", user);

            return ServerSuccessResponse(students);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 

    }


    @UseGuards(AuthGuard)
    @Get(":specifier")
    async getClass( 
        @Param("specifier") specifier: string,
        @Query('isId') isId: string = "true",
        @Request() req: Request,
    ) {

        try {
            // @ts-ignore
            const user = req["user"]

            if(!user){
                return ServerErrorResponse(new Error("Unauthenticated Request"), 401)
            }

            let thisClass: any | null = null;
            

            if(isId === "true"){
                thisClass = await this.service.getClassById(specifier)
            } else {
                thisClass = await this.service.getClass({ code: specifier })
            }
        
            if(!thisClass){
                return ServerErrorResponse(
                    new Error("Specified class could not be found"),
                    404,
                )
            }

            return ServerSuccessResponse(thisClass);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 

    }
}
