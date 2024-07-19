import { Injectable } from '@nestjs/common';
import { AnnouncementModel, AnnouncementSetModel, IAnnouncementDoc } from '@repo/models';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './announcements.dto';
import { generateCode } from '../utils';
import { Types, startSession } from 'mongoose';

@Injectable()
export class AnnouncementsService {

    async listAnnouncements(limit?: number, offset?: number, filter: Record<string, any> = {}, ): Promise<any>{
        const results = await AnnouncementModel.find(filter)
        .limit(limit ?? 10)
        .skip(offset ?? 0)
        .sort({ updatedAt: -1})
        .populate("createdBy updatedBy");
        return results;
    }

    async getAnnouncementsCount(filter: Record<string, any> = {}) {
        const count = await AnnouncementModel.countDocuments(filter);
        return count;
    }

    async getAnnouncement(filter: Record<string, any>): Promise<any>{
        const result = await AnnouncementModel.findOne(filter).populate("createdBy updatedBy");
        return result;
    }

    async createAnnouncement(
        announcementSetId: unknown, 
        creatorId: unknown, 
        announcementData: CreateAnnouncementDto 
    ): Promise<IAnnouncementDoc> {
        const session = await startSession()
        return session.withTransaction(async ( session ) => {
            const timestamp = new Date();
            const prefix = "ANMT"
            
            const { authToken, class: relatedClass, ...actualData } = announcementData;
    
            const relatedAnnouncementSet = await AnnouncementSetModel.findById(`${announcementSetId}`);
    
            if(!relatedAnnouncementSet){
                throw new Error('Specified Announcement Set could not be found.');
            }
            
            const newAnnouncement = new AnnouncementModel({
                code: generateCode(await AnnouncementModel.countDocuments(), prefix),
                ...actualData,
                announcementSet: relatedAnnouncementSet._id,
                meta: {
                    isDeleted: false
                },
                createdBy: new Types.ObjectId(creatorId as string),
                updatedBy: new Types.ObjectId(creatorId as string),
                createdAt: timestamp,
                updatedAt: timestamp,
            })
    
            newAnnouncement.save({ session });

            relatedAnnouncementSet.announcements.push(newAnnouncement._id);
            relatedAnnouncementSet.totalAnnouncements += 1;
            relatedAnnouncementSet.save({ session });
            return newAnnouncement;
        })  
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

    ): Promise<IAnnouncementDoc> {
        const announcement = await AnnouncementModel.findByIdAndUpdate(_id, {
            $set: {
                meta: {
                    isDeleted: true,
                }
            }
        }, { new: true })

        if(!announcement){
            throw new Error("Specified Announcement could not be found");
        }

        return announcement;

    }
}
