import { Body, Controller, Get, Query, Post, Request, UseGuards, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from '../common/services/user.service';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { IUserDoc, UserModel } from '@repo/models';
import { AuthGuard } from '../common/guards/jwt.guard';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from './user.dto';
import { JwtService } from '../common/services/jwt.service';
import { Roles } from '../common/enums/roles.enum';
import { ClassesService } from '../classes/classes.service';
import { AnnouncementsService } from '../announcements/announcements.service';
import { Types } from 'mongoose';
import { AssignmentsService } from '../assignments/assignments.service';

@Controller({
    path: 'users',
    version: '1',
})

export class UsersController {

    constructor(
        private user: UserService,
        private jwt: JwtService,
        private classes: ClassesService,
        private announcements: AnnouncementsService,
        private assignments: AssignmentsService,
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    async getAllUsers(
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

            const users = await this.user.getUsers(limit, offset, filter)
            const count = await this.user.getCount(filter);
    
            return ServerSuccessResponse<{ users: IUserDoc[], count: number}>({
                users,
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
    async createUser(
        @Body() userData: CreateUserDto,
    
    ) {
        try {
            const creator = await this.jwt.validateToken(userData.authToken);

            if(!creator){
                return ServerErrorResponse(
                    new Error("Unauthenticated Request"),
                    401
                )
            }

            if(creator.role != 'SUDO'){
                return ServerErrorResponse(
                    new Error("Unauthorized Request"),
                    401
                )
            }

            const user = await this.user.createAdmin(userData, `${creator._id}`);
            return ServerSuccessResponse(user);
        } catch(err) {
            return ServerErrorResponse(
                new Error(`${err}`),
                500
            )
        }

    }

    @UseGuards(AuthGuard)
    @Get('upgrade-to-sudo')
    async upgradeToSudo(
        @Query('adminId') adminId: string, 
        @Request() req: any
    ) {
        try {
            const user = req['user']

            if(user.role !== Roles.SUDO) {
                return ServerErrorResponse(new Error('Unauthorized Request'), 401)
            } 

            const updatedUser = await this.user.upgradeToSudo(adminId)
            console.log("Updated admin", updatedUser.code,"to SUDO");
            return ServerSuccessResponse(updatedUser)

       } catch (error) {
        return ServerErrorResponse(new Error(`${error}`), 500)
       }
    }

    @UseGuards(AuthGuard)
    @Get('downgrade-to-admin')
    async downgradeToAdmin(@Query('sudoId') sudoId: string, @Request() req: any) {
        try {
            const user = req['user']

            if(user.role !== Roles.SUDO) {
                return ServerErrorResponse(new Error('Unauthorized Request'), 401)
            }

            const updatedUser = await this.user.downgradeToAdmin(sudoId)
            console.log("Downgraded SUDO", updatedUser.code,"to admin")
            return ServerSuccessResponse(updatedUser)

        } catch (error) {
            return ServerErrorResponse(new Error(`${error}`), 500)
        }
    }

    @Patch('update-password')
    async updatedPassword(
        @Body() updatePasswordData: UpdatePasswordDto,
    ) {
        try {
            const response = await this.user.updatePassword(updatePasswordData)
            return response
        } catch (error) {
            return ServerErrorResponse(new Error(`${error}`), 500)
        }
    }

    @Patch(":_id")
    async updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @Param("_id") _id: string,
    ) {
        try {
            if(!updateUserDto.authToken){
                return ServerErrorResponse(new Error("Unauthenticated Request"), 401)
            }

            const updator = await this.jwt.validateToken(updateUserDto.authToken);

            if(!updator){
                return ServerErrorResponse(new Error("Unauthenticated Request"), 401)
            }

            if (updator.role !== 'SUDO' && updator._id !== _id) {
                return ServerErrorResponse(new Error("Unauthorized Request"), 401)
            }

            const updatedUser = await this.user.updateUser(_id, updateUserDto)
            console.log("Updated user", updatedUser.code);
            return ServerSuccessResponse(updatedUser)
       
        } catch (error) {
            return ServerErrorResponse(new Error(`${error}`), 500)
        }
    }

    @UseGuards(AuthGuard)
    @Delete(":_id")
    async deleteUser(
        @Param("_id") _id: string,
        @Req() req: any
    ) {
        try {
            const actor = req.user;

            if(!actor){
                return ServerErrorResponse(new Error("Unauthenticated Request"), 401)
            }

            if (actor.role !== 'SUDO' && actor._id !== _id) {
                return ServerErrorResponse(new Error("Unauthorized Request"), 401)
            }

            const deletedUser = await this.user.deleteUser(_id, `${actor}`);
            console.log("Soft-deleted user", deletedUser.code);
            return ServerSuccessResponse(deletedUser)
        
        } catch (err) {
            return ServerErrorResponse(
                new Error(`${err}`), 
                500
            )
        }

    }

    @UseGuards(AuthGuard)
    @Get("announcements")
    async getAnnouncementsForLMS(
        @Req() req: any,
    ) {
     
        try{
            const user = req.user;
            if(!user){
                return ServerErrorResponse(
                    new Error('Unauthenticated Request'),
                    401
                )
            }
            if(user.role != Roles.STUDENT){
                return ServerErrorResponse(
                    new Error('Unauthorized Request'),
                    403
                )
            }
            const announcements = await this.announcements.getAnnouncementsForLMS(user.classes)
            return ServerSuccessResponse(announcements);

        }catch (err) {
            return ServerErrorResponse(
                new Error(`${err}`), 
                500
            )
        }
    }


    @UseGuards(AuthGuard)
    @Get('count')
    async getUserCount( 
        @Query('filter') rawFilter: string
    ){
        try{
            let filter = rawFilter ? JSON.parse(rawFilter) : {}
            const user_count = await this.user.getUserCount(filter)
            return ServerSuccessResponse(user_count);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }

    @UseGuards(AuthGuard)
    @Get(":_id/classes")
    async getClassesByUser(
        @Param("_id") _id: string,
        @Request() req: Request, 
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

            // @ts-ignore
            const user = req["user"];

            const result = await this.classes.getClasses(limit, offset, {...filter, _id: { $in: user.classes } });

            const classIds = result.map(c => c._id);

            const count = await this.classes.getClassesCount({ _id: { $in: classIds } })

            return ServerSuccessResponse({
                classes: result,
                count,
            });
        

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }

    @UseGuards(AuthGuard)
    @Get(":_id/classes/count")
    async getClassesNumberByUser(
        @Param("_id") _id: string,
        @Request() req: Request,
        @Query('filter') rawFilter: string,
    ){  
        try {
            let filter = rawFilter ? JSON.parse(rawFilter) : {}
    
            // @ts-ignore
            const user = req["user"] as IUserDoc;

            const count = await this.classes.getClassesCount({ _id: { $in: user.classes }, ...filter })

            return ServerSuccessResponse(count);
        

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }



    @UseGuards(AuthGuard)
    @Get(":_id/announcements")
    async getAnnouncementsByUser(
        @Param("_id") _id: string,
        @Request() req: Request, @Query('limit') rawLimit: string,
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

            // @ts-ignore
            const user = req["user"];

            const result = await this.announcements.getAnnouncementsByUser(user._id, limit, offset, filter);
            const count = result.length

            return ServerSuccessResponse({
                announcements: result,
                count,
            });
        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }

    @UseGuards(AuthGuard)
    @Get(":_id/announcements/count")
    async getAnnouncementNumberByUser(
        @Param("_id") _id: string,
        @Request() req: Request,
        @Query('filter') rawFilter: string,
    ){  
        try {
            let filter = rawFilter ? JSON.parse(rawFilter) : {}
    
            // @ts-ignore
            const user = req["user"] as IUserDoc;

            const classes = await this.classes.getClasses(100, 0, { _id: { $in: user.classes.map( c => new Types.ObjectId(c)) } })

            const count = await this.announcements.getAnnouncementsCount({ announcementSet: { $in: classes.map( c => c.announcementSet ) }, "meta.isDeleted": false, ...filter})

            return ServerSuccessResponse(count);
        

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }

    @UseGuards(AuthGuard)
    @Get(':specifier/assignments')
    async getUserAssignments( 
        @Param('specifier') specifier: string,
        @Query('isId') isId: string = "true",
        @Req() req: any
    ) {
        try {

            const IsId = isId === "true";
            const user = req.user as IUserDoc;

            const assignments = await this.user.getUserAssignments(user)
            return ServerSuccessResponse(assignments);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }

    @UseGuards(AuthGuard)
    @Get(":_id/assignments/count")
    async getAssignmentsNumberByUser(
        @Param("_id") _id: string,
        @Request() req: Request,
        @Query('filter') rawFilter: string,
    ){  
        try {
            let filter = rawFilter ? JSON.parse(rawFilter) : {}
    
            // @ts-ignore
            const user = req["user"] as IUserDoc;

            const count = await this.assignments.getCount({ class: { $in: user.classes }, ...filter })

            return ServerSuccessResponse(count);
        

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }
    
  //@UseGuards(AuthGuard)
    @Get(':specifier/completed-lessons')
    async getCompletedLessons(
        @Param('specifier') specifier: string,
        @Query('isId') isId: string = "true",
        @Req() req: any
    ) {
        try {
        const IsId = isId === "true"; 
        const completedLessons = await this.user.getCompletedLessons(specifier, IsId);

        if (!completedLessons) {
            return ServerErrorResponse(new Error('No completed lessons found'), 404);
        }

        return ServerSuccessResponse(completedLessons);
        } catch (err) {
        return ServerErrorResponse(new Error(`${err}`), 500);
        }
    }

   // @UseGuards(AuthGuard)
    @Get(':specifier/completed-modules')
    async getCompletedModules(
        @Param('specifier') specifier: string,
        @Query('isId') isId: string = "true",
        @Req() req: any
    ) {
        try {
        const IsId = isId === "true";
         
        const completedModules = await this.user.getCompletedModules(specifier,  IsId);
         
        if (!completedModules) {
            return ServerErrorResponse(new Error('No completed modules found'), 404);
        }

        return ServerSuccessResponse(completedModules);
        } catch (err) {
        return ServerErrorResponse(new Error(`${err}`), 500);
        }
    }
    

    @UseGuards(AuthGuard)
    @Post(':userId/completed-lessons/:lessonId')
    async markLessonAsCompleted(
        @Param('lessonId') lessonId: string,
        @Request() req: any
    ) {
        try {
            const user = req['user'];
            if (!user) {
                return ServerErrorResponse(new Error('Unauthenticated'), 401);
            }

            const completedLesson = await this.user.markAsCompleteLessons(
                user._id,
                new Types.ObjectId(lessonId),
            );

            return ServerSuccessResponse(completedLesson);
        } catch (err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        }
    }


    @UseGuards(AuthGuard)
    @Post(':userId/completed-modules/:moduleId')
    async markAsCompleteModule(
    @Param('moduleId') moduleId: Types.ObjectId,
    @Request() req: any
    ) {
    try {
        const user = req.user; 
        const moduleDoc = await this.user.markAsCompleteModule(user._id, moduleId);
        return ServerSuccessResponse(moduleDoc);
    } catch (err) {
        return ServerErrorResponse(new Error(`${err}`), 500);
    }
    }

}
