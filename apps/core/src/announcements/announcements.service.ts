import { BadRequestException, Injectable } from '@nestjs/common';
import { AnnouncementModel, AnnouncementSetModel, ClassModel, IAnnouncement, IAnnouncementDoc, IUserDoc, UserModel } from '@repo/models';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './announcements.dto';
import { generateCode } from '../utils';
import { Types, startSession } from 'mongoose';
import { forEach } from 'lodash';

@Injectable()
export class AnnouncementsService {

    async listAnnouncements(
        limit?: number, 
        offset?: number, 
        filter: Record<string, any> = {}
    ): Promise<
    (Omit<IAnnouncement, "createdBy" | "updatedBy" > & { createdBy: IUserDoc, updatedBy: IUserDoc }) []>{
        const results = await AnnouncementModel.find({
            ...filter,
            "meta.isDeleted": false,
        })
        .limit(limit ?? 10)
        .skip(offset ?? 0)
        .sort({ createdAt: -1})
        .populate<{ createdBy: IUserDoc, updatedBy: IUserDoc }>("createdBy updatedBy")
        return results;
    }

    async getAnnouncementsCount(filter: Record<string, any> = {}) {
        const count = await AnnouncementModel.countDocuments({ ...filter, "meta.isDeleted": false });
        return count;
    }

    async getAnnouncement(filter: Record<string, any>): Promise<IAnnouncementDoc|null>{
        const result = await AnnouncementModel.findOne(filter).populate("createdBy updatedBy");
        return result;
    }

    async createAnnouncement(
        isToEveryOne: boolean,
        creatorId: unknown, 
        announcementData: CreateAnnouncementDto,
        announcementSetId?: unknown, 
    ): Promise<IAnnouncementDoc> {
        const timestamp = new Date();
        const prefix = "ANMT"
        
        const { authToken, classCode: relatedClassCode, ...actualData } = announcementData;

        if(!isToEveryOne){
            const relatedAnnouncementSet = await AnnouncementSetModel.findById(`${announcementSetId}`);
    
            if(!relatedAnnouncementSet){
                throw new Error('Specified Announcement Set could not be found.');
            }
            
            const newAnnouncement = new AnnouncementModel({
                code: await generateCode(await AnnouncementModel.countDocuments({ code: { $regex: /ANMT/ }}), prefix),
                ...actualData,
                announcementSet: relatedAnnouncementSet._id,
                class: relatedAnnouncementSet.class,
                meta: {
                    isDeleted: false
                },
                createdBy: new Types.ObjectId(`${creatorId}`),
                updatedBy: new Types.ObjectId(`${creatorId}`),
                createdAt: timestamp,
                updatedAt: timestamp,
            })
    
            await newAnnouncement.save();
    
            relatedAnnouncementSet.announcements.push(newAnnouncement._id);
            await relatedAnnouncementSet.save();
            return newAnnouncement;
        }

        const newAnnouncementToEveryOne = new AnnouncementModel({
            code: await generateCode(await AnnouncementModel.countDocuments({ code: { $regex: /ANMT/ }}), prefix),
            ...actualData,
            meta: {
                isDeleted: false
            },
            createdBy: new Types.ObjectId(`${creatorId}`),
            updatedBy: new Types.ObjectId(`${creatorId}`),
            createdAt: timestamp,
            updatedAt: timestamp,
        })

        await AnnouncementSetModel.updateMany({},{
            $push: {
                announcements: newAnnouncementToEveryOne._id
            }
        })

        await newAnnouncementToEveryOne.save()

        return newAnnouncementToEveryOne;

    }

    async updateAnnouncement(
        _id: string,
        updatorId: string,
        announcementData: UpdateAnnouncementDto,
    ): Promise<IAnnouncementDoc> {

        const { authToken, ...updateData } = announcementData;

        const timestamp = new Date();
        const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(_id, {
            $set: {
                ...updateData,
                updatedAt: timestamp,
                updatedBy: new Types.ObjectId(updatorId)
            }
        }, { new: true });

        if(!updatedAnnouncement){
            throw new Error("Specified Announcement could not be found");
        }

        return updatedAnnouncement;
        
    }

    async deleteAnnouncement(
        _id: string,
        deletor: string,

    ): Promise<IAnnouncementDoc> {
        const timestamp = new Date();

        const announcement = await AnnouncementModel.findByIdAndUpdate(_id, {
            $set: {
                meta: {
                    isDeleted: true,
                },
                updatedAt: timestamp,
                updatedBy: new Types.ObjectId(deletor)
            }
        }, { new: true })

        if(!announcement){
            throw new Error("Specified Announcement could not be found");
        }

        return announcement;

    }

    async getAnnouncementsByUser(
        userId: string,
        limit?: number, 
        offset?: number, 
        filter: Record<string, any> = {}, 
    ): Promise<IAnnouncementDoc[]> {

        const user = await UserModel.findById(userId);

        if(!user){{
            throw new Error("Specified user could not be found")
        }}

        const classes = await ClassModel.find({ _id: { $in: user.classes }});

        if(!classes){
            throw new Error("Specified user is not related with any class")
        }   

        const announcementSetIds = classes.map(c => c.announcementSet)
        const announcementSets = await AnnouncementSetModel.find({ _id: { $in: announcementSetIds }});

        let announcementIds: Types.ObjectId[] = []

        announcementSets.forEach(aset => {
            announcementIds = [
                ...announcementIds,
                ...aset.announcements,
            ]
        })

        const announcements = await AnnouncementModel.find({ _id: { $in: announcementIds },  ...filter, "meta.isDeleted": false }).limit(limit ?? 10).skip(offset ?? 0).sort({ createdAt: -1 }).populate("createdBy updatedBy");

        return announcements;

    }

    async publishAnnouncement(
        specifier: string,
        isId: boolean,
        updator: string,
    ) {
        let announcement;
        const timestamp = new Date();

        if(isId == false){
            announcement = await this.getAnnouncement({ code: specifier })
        } else {
            announcement = await this.getAnnouncement({ _id: new Types.ObjectId(specifier) })
        }

        if(!announcement){
            throw new Error("Specified Announcement could not be found");
        }

        if(!announcement.isDraft){
            throw new BadRequestException("Specified announcement is already public");
        }

        announcement.isDraft = false;
        announcement.updatedAt = timestamp;

        announcement.updatedBy = new Types.ObjectId(updator);

        await announcement.save()
        
        return announcement;
    }

    async getAnnouncementsForLMS(
       userClasses: object[],
    ): Promise<IAnnouncementDoc[]> {
        const classes = await ClassModel.find({ _id: { $in: userClasses }});
        const filter = { isDraft: false, "meta.isDeleted": false }
        if(!classes){
            throw new Error("Specified user is not related with any class")
        }   
        const anouncementSetIds = classes.map(c => c.announcementSet)
        const announcementSets = await AnnouncementSetModel.find({ _id: { $in: anouncementSetIds }});
        let announcementIds: Types.ObjectId[] = []

        announcementSets.forEach(aset => {
            announcementIds = [
                ...announcementIds,
                ...aset.announcements,
            ]
        })

        const announcements = await AnnouncementModel.find({ _id: { $in: announcementIds }, ...filter, "meta.isDeleted": false }).sort({ createdAt: -1 }).populate("createdAt createdBy");
        return announcements;
    }

}
