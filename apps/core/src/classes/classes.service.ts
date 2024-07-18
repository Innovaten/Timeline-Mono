import { AnnouncementModel, AnnouncementSetModel, ClassModel, IAnnouncementDoc, IAnnouncementSetDoc, UserModel } from "@repo/models";
import { CreateClassDto, UpdateClassDto } from "./classes.dto";
import { Types } from "mongoose";
import { generateCode } from "../utils";
import { startSession } from 'mongoose'

export class ClassesService {
   
    async getClass(filter: Record<string, any> = {}){

        const result = await ClassModel.findOne(filter).populate<{ annoucementSet: IAnnouncementSetDoc }>("announcementSet");
        return result

    }

    async getClasses(limit?: number, offset?: number, filter?: Record<string, any>){
        const results = await ClassModel.find(filter ?? {}).limit(limit ?? 10).skip(offset ?? 0).sort({ updatedAt: -1})
        return results;
    }

    async getCount(filter?: Record<string, any>){
        return ClassModel.countDocuments(filter)
    }

    async createClass(classData: CreateClassDto, creator: string){

        const newSession = await startSession();
        const timestamp = new Date();

        return await newSession.withTransaction(async (session) => {

            const { authToken, ...actualData } = classData;
    
            const anmtSetPrefix = "ASET";
            const newAnnouncementSet = new AnnouncementSetModel({
                code: await generateCode(await AnnouncementSetModel.countDocuments(), anmtSetPrefix),
                totalAnnouncements: 0,
                announcements: [],

                createdAt: timestamp,
                updatedAt: timestamp,
                createdBy: new Types.ObjectId(creator),
                updatedBy: new Types.ObjectId(creator),
            })

            const newClass = new ClassModel({
                code: await generateCode(await ClassModel.countDocuments(), "CLS"),
                ...actualData,
                status: "Active",
                administrators: [],
                lessons: [],
                resources: [],
                assignments: [],
                quizzes: [],
                announcementSet: newAnnouncementSet._id,
    
                createdBy: new Types.ObjectId(creator),
                updatedBy: new Types.ObjectId(creator),
            })
    
            newAnnouncementSet.class = new Types.ObjectId(`${newClass._id}`);

            newAnnouncementSet.save({ session })
            newClass.save({ session })
    
            return newClass;
        })
    }

    
    async updateClass(_id: string, updatedData: UpdateClassDto, updator: string){

        const { authToken, ...actualData } = updatedData;

        const tClass = await ClassModel.findByIdAndUpdate(_id, {
            ...actualData,
            updatedBy: new Types.ObjectId(updator),
            updatedAt: new Date()
        }, { new: true });

        return tClass;
    }

    async assignAdministrator(classId: string, adminId: string) {
        const classDoc = await ClassModel.findById(classId);
        const adminDoc = await UserModel.findById(adminId);

        if(!adminDoc){
            throw new Error("Specified administrator could not be found")
        }

        if (!classDoc) {
            throw new Error("Specified class not found")
        }

        classDoc.administrators.push(new Types.ObjectId(`${adminDoc._id}`))
        adminDoc.classes.push(new Types.ObjectId(`${classDoc._id}`));


        classDoc.updatedAt = new Date();
        await classDoc.save()

        return classDoc
    }

    async deleteClass( classId: string, actor: string){
        const classDoc = await ClassModel.findById(classId)

        if (!classDoc) {
            throw new Error("Specified class not found")
        }

        classDoc.meta.isDeleted = true;
        classDoc.updatedAt = new Date();
        classDoc.updatedBy = new Types.ObjectId(actor);

        await classDoc.save();

        return classDoc;

    }

    async getClassesCount(filter: Record<string, any>){
        const count = await ClassModel.countDocuments(filter);
        return count;
    }

    async getAnnouncementsByClass(classId: string): Promise<IAnnouncementDoc[]> {

        const classDoc = await ClassModel.findById(classId);

        if(!classDoc){
            throw new Error("Specified class could not be found");
        }

        const announcements = await AnnouncementModel.find({ announcementSet: classDoc.announcementSet}).populate("createdBy updatedBy");

        return announcements;
    }
}