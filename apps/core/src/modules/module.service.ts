import { ModuleModel, IModuleDoc, LessonSetModel, ILessonSetDoc, ILessonDoc } from "@repo/models";
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
    creator: string,
  ): Promise<IModuleDoc> {

    const timestamp = new Date()
    const isAuthorized = await this.assignedService.isAdminOrSudo(creator, moduleData.classCode);

    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to create a module for this class!');
    }

    const relatedClass = await ClassModel.findOne({ code: moduleData.classCode })

    if(!relatedClass){
      throw new BadRequestException('Related class was not found')
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
      createdBy: new Types.ObjectId(creator),
      updatedBy: new Types.ObjectId(creator),
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
    const module = await ModuleModel.findOne({code: moduleId}).populate("createdBy lessonSet");
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
      .populate("createdBy lessonSet")
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

}
