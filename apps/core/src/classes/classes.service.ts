import { ClassModel } from "@repo/models";
import { CreateClassDto, UpdateClassDto } from "./classes.dto";
import lodash from "lodash";
import { Types } from "mongoose";

export class ClassesService {
   
    async getClasses(limit?: number, offset?: number, filter?: Record<string, any>){
        const results = await ClassModel.find(filter ?? {}).limit(limit ?? 10).skip(offset ?? 0).sort({ updatedAt: -1})
        return results;
    }

    async getCount(filter?: Record<string, any>){
        return ClassModel.countDocuments(filter)
    }

    async createClass(classData: CreateClassDto, creator: string){

        const { authToken, ...actualData } = classData;
        const codePrefix = "CLS"

        const newClass = new ClassModel({
            code: codePrefix + lodash.padStart(`${await(ClassModel.countDocuments()) + 1}`, 6, "0"),
            ...actualData,
            status: "Active",
            administrators: [],
            lessons: [],
            resources: [],
            assignments: [],
            quizzes: [],

            createdBy: new Types.ObjectId(creator),
            updatedBy: new Types.ObjectId(creator),
        })

        newClass.save()

        return newClass;
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
        const classDoc = await ClassModel.findById(classId)

        if (!classDoc) {
            throw new Error("Class not found")
        }

        classDoc.administrators.push(new Types.ObjectId(adminId))
        await classDoc.save()

        return classDoc
    }
}