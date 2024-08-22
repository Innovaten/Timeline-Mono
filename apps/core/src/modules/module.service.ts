import { ModuleModel, IModuleDoc, LessonSetModel, ILessonSetDoc, ILessonDoc, IUserDoc } from "@repo/models";
import { Types } from "mongoose";
import { CreateModuleDto, UpdateModuleDto } from "./module.dto";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { ClassModel } from "@repo/models";
import { AssignedService } from "../common/services/assigned.service";
import { generateCode } from "../utils";

export class ModulesService {
  
  constructor (
    private assignedService: AssignedService,
  ) {}

  async getCount(filter: Record<string, any> = {}){
    return ModuleModel.countDocuments(filter)
}

  async createModule(
    moduleData: CreateModuleDto,
    creator: IUserDoc,
  ): Promise<IModuleDoc> {

    const timestamp = new Date()

    const relatedClass = await ClassModel.findOne({ code: moduleData.classCode })

    if(!relatedClass){
      throw new BadRequestException('Related class was not found')
    }

    if(
      creator.role !== "SUDO" && 
      !relatedClass.administrators.map(a => a.toString()).includes(`${creator._id}`)
    ) {
      throw new ForbiddenException("You are not permitted to perform this action")
    }

    const newLessonSet =  new LessonSetModel({
      class: `${relatedClass._id}`,      
      lessons: [],
      createdAt: timestamp,
      updatedAt: timestamp,
  })

    const newModule = new ModuleModel({
      code: await generateCode(await ModuleModel.countDocuments(), "MDL"),
      title: moduleData.title,
      lessonSet: newLessonSet.id,
    
      classId: relatedClass.id,
      createdBy: new Types.ObjectId(`${creator._id}`),
      updatedBy: new Types.ObjectId(`${creator._id}`),

      resources: moduleData?.resources.map(r => new Types.ObjectId(r)) ?? [],
      createdAt: timestamp,
      updatedAt: timestamp,
      meta: {
        isDeleted: false,
      },
    });

    newLessonSet.module = newModule.id;

    await newLessonSet.save();
    await newModule.save();

    return newModule;
  }

  async updateModule(
    id: string,
    moduleData: UpdateModuleDto,
    updater: string
  ): Promise<any> {
  
    const { authToken, classCode, ...actualData} = moduleData;

    return await ModuleModel.findByIdAndUpdate(
      id,
      {
        ...actualData,
        ...(actualData.resources ? { resources: actualData.resources.map(r => new Types.ObjectId(r))}: {}),
        updatedBy: new Types.ObjectId(updater),
        updatedAt: new Date(),
      }, 
      { new: true }
    );
  }
  
  async deleteModule(moduleId: string, actorId: string): Promise<IModuleDoc> {
    
    const module = await ModuleModel.findById(moduleId);
    if (!module) {
      throw new Error("Module not found");
    }

    module.meta.isDeleted = true;
    module.updatedBy = new Types.ObjectId(actorId);
    module.updatedAt = new Date();

    await module.save();

    return module;
  }

  async getModule(moduleId: string, isId: boolean): Promise<IModuleDoc | null> {
    const module = await ModuleModel.findOne({code: moduleId}).populate("createdBy resources lessonSet");
    if (!module) {
      throw new Error("Module not found");
    }
    return module;
  }

  async getModules(
    limit: number = 10,
    offset: number = 0,
    filter: any = {}
  ): Promise<IModuleDoc[]> {
    
    const modules = await ModuleModel.find(filter)
      .skip(offset)
      .limit(limit)
      .populate("createdBy resources lessonSet")
      .sort({ createdAt: -1 });

    return modules;
  }

  async getLessonsByModule(module: string){
  
    const relatedModule = await ModuleModel.findById(module).populate<{ lessonSet: { lessons: ILessonDoc[]}}>({ path: "lessonSet.lessons"});

    if(!relatedModule){
      throw new BadRequestException('Specified module not found')
    }

    return relatedModule.lessonSet.lessons;

  }

  async getModulesByClass(classCode: string): Promise<IModuleDoc[]> {
    const relatedClass = await ClassModel.findOne({ code: classCode });

    if(!relatedClass){
      throw new BadRequestException('Specified class not found')
    }

    const modules = await ModuleModel.find({ classId: relatedClass.id }).populate("createdBy lessonSet");

    return modules;
  }

  async getModuleCountByClass(classCode: string): Promise<number> {
    const relatedClass = await ClassModel.findOne({ code: classCode });

    if(!relatedClass){
      throw new BadRequestException('Specified class not found')
    }

    const count = await ModuleModel.countDocuments({ classId: relatedClass.id });
    return count;
}
}
