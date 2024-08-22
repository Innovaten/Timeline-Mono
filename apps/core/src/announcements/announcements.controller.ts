import { Controller, Get, Patch, Post, UseGuards, Request, Query, Param, Body, Delete, Req, ForbiddenException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { sendInternalServerError } from '../utils';
import { AuthGuard } from '../common/guards/jwt.guard';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { Roles } from '../common/enums/roles.enum';
import { AnnouncementsService } from './announcements.service';
import { JwtService } from '../common/services/jwt.service';
import { CreateAnnouncementDto , UpdateAnnouncementDto} from './announcements.dto';
import { ClassesService } from '../classes/classes.service';
import { Types } from 'mongoose';
import { IAnnouncement, IAnnouncementDoc } from '@repo/models';
import { IUserDoc } from '@repo/models';

@Controller({
    path: 'announcements',
    version: "1"
})
export class AnnouncementsController {

    constructor(
        private service: AnnouncementsService,
        private jwt: JwtService,
        private classes: ClassesService,
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    async listAnnouncements(
        @Query('limit') rawLimit: string,
        @Query('offset') rawOffset: string,
        @Query('filter') rawFilter: string,
        @Request() req: Request,
    ) {
        try {
            // @ts-ignore
            const user = req["user"]

            if(!user){
                throw new UnauthorizedException('Unauthenticated Request')
            }

            if(user.role != Roles.SUDO){
                throw new ForbiddenException("You are not permitted to perform this action")
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

            const announcements = await this.service.listAnnouncements(limit, offset, filter);
            const count = await this.service.getAnnouncementsCount(filter);

            return ServerSuccessResponse<{ 
                announcements: (Omit<IAnnouncement, "createdBy" | "updatedBy" > & { createdBy: IUserDoc, updatedBy: IUserDoc })[],
                count: number 
            }>({
                announcements,
                count
            })

        } catch(err: any){
            return ServerErrorResponse(
                new Error(`${err.message ? err.message : err}`),
                err.status ? err.status : 500
            );
        }

    }

    @Post()
    @UseGuards(AuthGuard)
    async createAnnouncement(
        @Body() announcementData: CreateAnnouncementDto,
        @Req() req: any
    ){
        try {
            // @ts-ignore
            const creator = req.user
            
            if(!creator){
                throw new UnauthorizedException('Unauthenticated Request')
            }

            let announcement: IAnnouncementDoc

            if(announcementData.classCode == "*") { // Sudo request to announce to everyone

                if(creator.role != Roles.SUDO){
                    throw new ForbiddenException('You are not permitted to perform this action')
                }

                announcement = await this.service.createAnnouncement(true, creator._id, announcementData);
                
                return ServerSuccessResponse(announcement);
            }

            const relatedClass = await this.classes.getClass({ code: announcementData.classCode }) 

            if(!relatedClass) {
                throw new NotFoundException("Specified class does not exist")
            }

            if(creator.role != Roles.SUDO && !relatedClass.administrators.map(a => `${a._id}`).includes(`${creator._id}`) ){
                throw new ForbiddenException('You are not permitted to perform this action')
            }
            announcement = await this.service.createAnnouncement(false, creator._id, announcementData, relatedClass?.announcementSet._id);

            return ServerSuccessResponse(announcement);


        } catch (err: any) {
            return ServerErrorResponse(
                new Error(`${err.message ? err.message : err}`),
                err.status ? err.status : 500
            );
        }
    }

    @UseGuards(AuthGuard)
    @Get("count")
    async getAnnouncementCount(
        @Query('filter') rawFilter: string,
        @Req() req: any,
    ){
        try{
            const user = req.user as IUserDoc;
            if(!user){
                throw new UnauthorizedException('Unauthenticated Request')
            }

            if(user.role == "STUDENT"){
                throw new ForbiddenException("Unauthorized Request")
            }
        
            const filter =  rawFilter ? JSON.parse(rawFilter) : {};
            const classes_count = await this.service.getAnnouncementsCount(filter)
            
            return ServerSuccessResponse<number>(classes_count); 

        } catch(err: any) {
            return ServerErrorResponse (
                new Error(`${err.message ? err.message : err}`), 
                err.status ? err.status : 500
            );
        }   
    }

    @Patch(":_id")
    @UseGuards(AuthGuard)
    async updateAnnouncement(
        @Param("_id") _id: string,
        @Body() announcementData: UpdateAnnouncementDto,
        @Req() req: any
    ) {
        try {
            const updator = req.user
            
            if(!updator){
                throw new UnauthorizedException('Unauthenticated Request')
            }

            const relatedClass = await this.classes.getClass({ code: announcementData.classCode }) 

            if(!relatedClass) {
                throw new NotFoundException("Specified class does not exist")
            }

            if(updator.role != Roles.SUDO && !relatedClass?.administrators.map(a => `${a._id}`).includes(`${updator._id}`)){
                throw new ForbiddenException('You are not permitted to perform this action')
            }

            const updatedAnnouncement = await this.service.updateAnnouncement(_id, `${updator._id}`, announcementData);

            return ServerSuccessResponse(updatedAnnouncement);

        } catch (err: any) {
            return ServerErrorResponse(
                new Error(`${err.message ? err.message : err}`),
                err.status ? err.status: 500
            );
        }
    }

    @UseGuards(AuthGuard)
    @Delete(":_id")
    async deleteAnnouncement(
        @Param("_id") _id: string,
        @Query("classCode") classCode: string,
        @Request() req: Request,
    ) {
        try {
            // @ts-ignore
            const deletor = req["user"]
            
            if(!deletor){
                return ServerErrorResponse(
                    new Error('Unauthenticated Request'),
                    401
                )
            }

            const relatedClass = await this.classes.getClass({ code: classCode }) 

            if(!relatedClass) {
                return ServerErrorResponse(
                    new Error("Specified class does not exist"),
                    400
                )
            }

            if(deletor.role != Roles.SUDO && !relatedClass?.administrators.map(a => `${a._id}`).includes(`${deletor._id}`)){
                return ServerErrorResponse(
                    new Error('You are not permitted to perform this action'),
                    401
                )
            }

            const deletedAnnouncement = await this.service.deleteAnnouncement(_id, `${deletor._id}`);

            return ServerSuccessResponse(deletedAnnouncement);

        } catch (err) {
            return sendInternalServerError(err);
        }
    }

    @UseGuards(AuthGuard)
    @Get(":specifier/publish")
    async publishDraftedAnnouncement(
        @Param('specifier') specifier: string,
        @Query("classCode") classCode: string,
        @Query("isId") isId: boolean = true,
        @Request() req: Request
    ) {
        try {
            // @ts-ignore
            const updator = req["user"];
            
            if(!updator){
                return ServerErrorResponse(
                    new Error('Unauthenticated Request'),
                    401
                )
            }

            const relatedClass = await this.classes.getClass({ code: classCode }) 

            if(!relatedClass) {
                return ServerErrorResponse(
                    new Error("Specified class does not exist"),
                    400
                )
            }

            if(updator.role != Roles.SUDO && !relatedClass?.administrators.map(a => `${a._id}`).includes(`${updator._id}`)){
                return ServerErrorResponse(
                    new Error('You are not permitted to perform this action'),
                    401
                )
            }

            const announcement = await this.service.publishAnnouncement(specifier, isId, `${updator._id}`)

            return ServerSuccessResponse(announcement);
            
        } catch (err) {
            return sendInternalServerError(err);
        }
    }

    @UseGuards(AuthGuard)
    @Get(":specifier")
    async getAnnouncement(
        @Param("specifier") specifier: string,
        @Query("isId") isId: string,
    ) {
        try {
            const isIdFlag = isId != 'false';
            const filter = isIdFlag ? { _id: new Types.ObjectId(specifier) } : { code: specifier }

            const announcement = await this.service.getAnnouncement(filter)
            return ServerSuccessResponse(announcement);

        } catch (err) {
            return sendInternalServerError(err);
        }
    }

}
