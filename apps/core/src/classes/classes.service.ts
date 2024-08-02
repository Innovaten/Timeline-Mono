import { AnnouncementModel, AnnouncementSetModel, ClassModel, IAnnouncementDoc, IAnnouncementSetDoc, IClassDoc, IUserDoc, UserModel, IModuleDoc, ModuleModel, AssignmentSetModel, IAssignmentSet, IAssignment, AssignmentModel, IAssignmentSetDoc  } from "@repo/models";

import { CreateClassDto, UpdateClassDto } from "./classes.dto";
import { Types } from "mongoose";
import { generateCode } from "../utils";
import { CreateAssigmentDto } from "../assignments/assignments.dto";
import { BadRequestException, ForbiddenException } from "@nestjs/common";

export class ClassesService {
   
    async getClass(filter: Record<string, any> = {}){

        const result = await ClassModel.findOne(filter).populate<{ announcementSet: IAnnouncementSetDoc, createdBy: IUserDoc, administrators: IUserDoc[], assignmentSet: { assignments: IAssignment}}>([
            {
                path: "createdBy administrators",
            },
            {
                path: "announcementSet",
                populate: "announcements"
            },
            {
                path: "assignmentSet",
                populate: "assignments",
            }
        ]);
        return result;
    }

    async getClassById(_id: string){
        const result = await ClassModel.findById(_id).populate<{ announcementSet: IAnnouncementSetDoc, createdBy: IUserDoc, administrators: IUserDoc[], assignmentSet: { assignments: IAssignment}}>([
        {
            path: "createdBy administrators",
        },
        {
            path: "announcementSet",
            populate: "announcements"
        },
        {
            path: "assignmentSet",
            populate: "assignments",
        }
    ]);
        return result;
    }

    async getClasses(limit?: number, offset?: number, filter?: Record<string, any>){
        const results = await ClassModel.find(filter ?? {}).limit(limit ?? 10).skip(offset ?? 0).sort({ updatedAt: -1})
        return results;
    }

    async getCount(filter?: Record<string, any>){
        return ClassModel.countDocuments(filter)
    }

    async createClass(classData: CreateClassDto, creator: string): Promise<IClassDoc>{
        const timestamp = new Date();
        
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
        
        const newAssignmentSet = new AssignmentSetModel({
            code: await generateCode((await AssignmentSetModel.countDocuments()), "ASSET"),
            assignments: [],
            createdBy: new Types.ObjectId(creator),
            updatedBy: new Types.ObjectId(creator), 
        })
        
        const newClass = new ClassModel({
            code: await generateCode(await ClassModel.countDocuments(), "CLS"),
            ...actualData,
            status: "Active",
            administrators: [],
            modules: [],
            resources: [],
            assignments: [],
            quizzes: [],
            announcementSet: newAnnouncementSet._id,
            assignmentSet: newAssignmentSet._id,

            createdBy: new Types.ObjectId(creator),
            updatedBy: new Types.ObjectId(creator),
        })

        newAnnouncementSet.class = new Types.ObjectId(`${newClass._id}`);
        
        newAssignmentSet.class = new Types.ObjectId(`${newClass._id}`);
        newAssignmentSet.classCode = newClass.code;

        await newAssignmentSet.save()
        await newAnnouncementSet.save()
        await newClass.save()
        
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

    async assignAdministrator(classId: string, adminId: string, updator: string) {
        const classDoc = await ClassModel.findById(classId);
        const adminDoc = await UserModel.findById(adminId);

        if(!adminDoc){
            throw new Error("Specified administrator could not be found")
        }

        if (!classDoc) {
            throw new Error("Specified class not found")
        }

        if(classDoc.administrators.includes(adminDoc.id)){
            throw new Error("Specified admin has already been assigned to this class")
        }
        classDoc.administrators.push(new Types.ObjectId(`${adminDoc._id}`))
        adminDoc.classes.push(new Types.ObjectId(`${classDoc._id}`));


        classDoc.updatedAt = new Date();
        classDoc.updatedBy = new Types.ObjectId(`${updator}`)
        adminDoc.updatedAt = new Date();

        await classDoc.save()
        await adminDoc.save()

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

    // This is the function that gets all the modules asscociated with a specific class (the classId needs to be passes as a parameter)
    async getModuleByClassId(classId: string, userRole: string): Promise<IModuleDoc[]> {
        const classDoc = await ClassModel.findById(classId)
        if (!classDoc) {
            throw new Error("Class not found")
        }

        if (userRole !== 'SUDO' && userRole !== 'ADMIN' ) {
            throw new Error("Unauthorized")
        }

        const modules = await ModuleModel.find({ _id: { $in: classDoc.modules } })
        return modules
    }

    async createAssignment(classId: string, assignmentData: CreateAssigmentDto, user: IUserDoc){

        const timestamp = new Date()
        const relatedClass = await ClassModel.findById(classId).populate<{ assignmentSet: IAssignmentSetDoc }>("assignmentSet")

        if(!relatedClass){
            throw new BadRequestException()
        }

        if(user.role !== "SUDO" || !relatedClass.administrators.map(id => id.toString()).includes(`${user._id}`) ){
            throw new ForbiddenException()
        }

        const newAssignment = new AssignmentModel({
            code: await generateCode( (await AssignmentModel.countDocuments()), "ASMNT"),
            
            title: assignmentData.title,
            instructions: assignmentData.instructions,
            maxScore: assignmentData.maxScore,

            assignmentSet: relatedClass.assignmentSet._id,
            
            class: relatedClass.id,
            classCode: relatedClass.code,

            resources: assignmentData.resources.map( a => new Types.ObjectId(a)),
            accessList: assignmentData.accessList.map( a => new Types.ObjectId(a)),

            startDate: assignmentData.startDate,
            endDate: assignmentData.endDate,
            
            meta: {
                isDeleted: false,
                isDraft: assignmentData.isDraft ?? true,
            },

            createdBy: new Types.ObjectId(`${user._id}`),
            updatedBy: new Types.ObjectId(`${user._id}`),
        })

        relatedClass.assignmentSet.assignments.push(newAssignment._id)
        relatedClass.assignmentSet.updatedAt = timestamp;
        relatedClass.assignmentSet.updatedBy = new Types.ObjectId(`${user._id}`)

        relatedClass.updatedAt = timestamp;
        relatedClass.updatedBy = new Types.ObjectId(`${user._id}`) 
        
        // create event
        await newAssignment.save()
        await relatedClass.save()
    }
}