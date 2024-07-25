import { ModuleModel, IModulesDoc } from "@repo/models";
import { Types } from "mongoose";
import { CreateModuleDto, UpdateModuleDto } from "./module.dto";
import { LessonSetsService } from "../common/services/lessonsets.service";
import { ILessonSetDoc } from "@repo/models";
import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { ClassModel } from "@repo/models";

export class ModulesService {
  private lessonSetsService: LessonSetsService;

  constructor() {
    this.lessonSetsService = new LessonSetsService();
  }


   async isAdminAssignedToClass(adminId: string, classId: string) {
    const classDoc = await ClassModel.findById(classId)

    if(!classDoc) {
      throw new Error("Specified class not found")
    }

    return classDoc.administrators.some((admin) => admin.equals(new Types.ObjectId(adminId)))
  }

  async getCount(filter: Record<string, any> = {}){
    return ModuleModel.countDocuments(filter)
}

async getLessonSetsByModuleId(moduleId: string, userRole: string) {
  if (userRole !== 'ADMIN' && userRole !== 'SUDO') {
    throw new UnauthorizedException('Unauthorized');
  }

  return this.lessonSetsService.findByModuleId(moduleId);
}


  async createModule(
    moduleData: CreateModuleDto,
    creator: string,
    classId: string,
  ): Promise<IModulesDoc> {

    const isAssigned = await this.isAdminAssignedToClass(creator, classId)

    if (!isAssigned) {
      throw new ForbiddenException('Not assigned to this class!')
    }


    const { lessonSet, ...actualData } = moduleData;

    const newModule = new ModuleModel({
      lessonSet: new Types.ObjectId(),
      ...actualData,
      createdBy: new Types.ObjectId(creator),
      updatedBy: new Types.ObjectId(creator),
      meta: {
        isDeleted: false,
      },
    });

    await newModule.save();

    return newModule;
  }

  async updateModule(
    moduleId: string,
    moduleData: UpdateModuleDto,
    updater: string
  ): Promise<IModulesDoc> {
    const existingModule = await ModuleModel.findById(moduleId);
    if (!existingModule) {
      throw new Error("Module not found");
    }
  
    const updatedLessonSets =
      moduleData.lessonSet &&
      (await Promise.all(
        moduleData.lessonSet.map((id) =>
          this.lessonSetsService.getLessonSetById(id)
        )
      ));
  
    if (updatedLessonSets && updatedLessonSets.some((ls) => !ls)) {
      throw new Error("One or more LessonSets not found");
    }
  
    const lessonSetIds = updatedLessonSets
      ?.filter((ls): ls is ILessonSetDoc => ls !== null)
      .map((ls) => new Types.ObjectId(ls._id as Types.ObjectId));
  
    existingModule.set({
      ...moduleData,
      lessonSet: lessonSetIds, // use filtered lessonSetIds
      updatedBy: new Types.ObjectId(updater),
      updatedAt: new Date(),
    });
  
    await existingModule.save();
    return existingModule;
  }
  
  async deleteModule(moduleId: string, actorId: string): Promise<IModulesDoc | null> {
    const module = await ModuleModel.findById(moduleId);
    if (!module) {
      throw new Error("Module not found");
    }

    module.meta.isDeleted = true;
    await module.save();

    return module;
  }

  async getModule(moduleId: string, user: string): Promise<IModulesDoc | null> {
    const module = await ModuleModel.findById(moduleId).populate("lessonSet");
    if (!module) {
      throw new Error("Module not found");
    }

    return module;
  }

  async getModules(
    limit: number = 10,
    offset: number = 0,
    filter: any = {}
): Promise<IModulesDoc[]> {
    

    const modules = await ModuleModel.find(filter)
        .skip(offset)
        .limit(limit)
        .populate("lessonSet")
        .sort({ createdAt: -1 });

    return modules;
}

}
