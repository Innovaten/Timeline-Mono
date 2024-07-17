import { Controller, Get, Patch, Post, Query, UseGuards, Request, Param, Body, Delete } from '@nestjs/common';
import { sendInternalServerError } from '../utils';
import { AuthGuard } from '../common/guards/jwt.guard';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { Roles } from '../common/enums/roles.enum';
import { AnnouncementsService } from './announcements.service';
import { JwtService } from '../common/services/jwt.service';
import { createAnnouncementDto , updateAnnouncementDto} from './announcements.dto';
import { ClassesService } from '../classes/classes.service';
import { Types } from 'mongoose';

@Controller('announcements')
export class AnnouncementsController {

    constructor(
        private service: AnnouncementsService,
        private jwt: JwtService,
        private classes: ClassesService,
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    async listAnnouncements(
        @Request() req: Request,
    ) {
        try {
            // @ts-ignore
            const user = req["user"]

            if(!user){
                return ServerErrorResponse(
                    new Error('Unauthenticated Request'),
                    401
                )
            }

            if(user.role != Roles.SUDO){
                return ServerErrorResponse(
                    new Error('Unauthorized Request'),
                    403
                )
            }

            const announcements = await this.service.getAnnouncements();
            const count = await this.service.getAnnouncementsCount();

            return ServerSuccessResponse({
                announcements,
                count
            })


        } catch(err){
            return sendInternalServerError(err);
        }

    }

    @Post()
    async createAnnouncement(
        @Body() announcementData: createAnnouncementDto 
    ){
        try {
            const creator = await this.jwt.validateToken(announcementData.authToken);
            
            if(!creator){
                return ServerErrorResponse(
                    new Error('Unauthenticated Request'),
                    401
                )
            }

            const relatedClass = await this.classes.getClass({ _id: new Types.ObjectId(announcementData.class) }) 

            if(creator.role != Roles.SUDO && !relatedClass?.administrators.includes(new Types.ObjectId(creator._id as Types.ObjectId)) ){
                return ServerErrorResponse(
                    new Error('You are not permitted to perform this action'),
                    401
                )
            }

            const announcement = await this.service.createAnnouncement(relatedClass?._id, `${creator._id}`, announcementData);

            return ServerSuccessResponse(announcement);


        } catch (err) {
            return sendInternalServerError(err);
        }
    }

    @Patch(":_id")
    async updateAnnouncement(
        @Param("_id") _id: string,
        @Body() announcementData: updateAnnouncementDto 
    ) {
        try {
            const creator = await this.jwt.validateToken(announcementData.authToken);
            
            if(!creator){
                return ServerErrorResponse(
                    new Error('Unauthenticated Request'),
                    401
                )
            }

            const relatedClass = await this.classes.getClass({ _id: new Types.ObjectId(announcementData.class) }) 

            if(creator.role != Roles.SUDO && !relatedClass?.administrators.includes(new Types.ObjectId(creator._id as Types.ObjectId)) ){
                return ServerErrorResponse(
                    new Error('You are not permitted to perform this action'),
                    401
                )
            }

            const updatedAnnouncement = await this.service.updateAnnouncement(_id, `${creator._id}`, announcementData);

            return ServerSuccessResponse(updatedAnnouncement);

        } catch (err) {
            return sendInternalServerError(err);
        }
    }

    @Delete(":_id")
    async deleteAnnouncement(
        @Param("_id") _id: string
    ) {
        try {
            const creator = await this.jwt.validateToken(announcementData.authToken);
            
            if(!creator){
                return ServerErrorResponse(
                    new Error('Unauthenticated Request'),
                    401
                )
            }

            const relatedClass = await this.classes.getClass({ _id: new Types.ObjectId(announcementData.class) }) 

            if(creator.role != Roles.SUDO && !relatedClass?.administrators.includes(new Types.ObjectId(creator._id as Types.ObjectId)) ){
                return ServerErrorResponse(
                    new Error('You are not permitted to perform this action'),
                    401
                )
            }

            const deletedAnnouncement = await this.service.deleteAnnouncement(_id);

            return ServerSuccessResponse(deletedAnnouncement);

        } catch (err) {
            return sendInternalServerError(err);
        }
    }

    @UseGuards(AuthGuard)
    @Get(":_id")
    async getAnnouncement(
        @Param("_id") _id: string
    ) {
        try {
            const announcement = await this.service.getAnnouncement({ _id: id})

            return ServerSuccessResponse(announcement);

        } catch (err) {
            return sendInternalServerError(err);
        }
    }

}
