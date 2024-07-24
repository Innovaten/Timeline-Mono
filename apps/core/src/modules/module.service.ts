import { ModuleModel, IModulesDoc } from "@repo/models";
import { Types } from "mongoose";
import { CreateModuleDto, UpdateModuleDto } from "./module.dto";
import { LessonSetsService } from "../common/services/lessonsets.service";
import { CompletedLessonsService } from "../common/services/completedlessons.service";
import { generateCode } from "../utils";
import { ILessonSetDoc } from "@repo/models";
import { UnauthorizedException } from "@nestjs/common";

export class ModulesService {
  private lessonSetsService: LessonSetsService;
  private completedLessonsService: CompletedLessonsService;

  constructor() {
    this.lessonSetsService = new LessonSetsService();
    this.completedLessonsService = new CompletedLessonsService();
  }

  async getCount(filter?: Record<string, any>){
    return ModuleModel.countDocuments(filter)
}

async getLessonSetsByModuleId(moduleId: string, userRole: string) {
  if (userRole !== 'ADMINISTRATOR' && userRole !== 'SUDO') {
    throw new UnauthorizedException('Unauthorized');
  }

  return this.lessonSetsService.findByModuleId(moduleId);
}


  async createModule(
    moduleData: CreateModuleDto,
    creator: string
  ): Promise<IModulesDoc> {
    const lessonSets = await Promise.all(
      moduleData.lessonSet.map((id) =>
        this.lessonSetsService.getLessonSetById(id)
      )
    );

    if (lessonSets.some((ls) => !ls)) {
      throw new Error("One or more LessonSets not found");
    }

    const { lessonSet, ...actualData } = moduleData;

    const newModule = new ModuleModel({
      code: await generateCode(await ModuleModel.countDocuments(), "MOD"),
      lessonSet: lessonSet.map((ls) => new Types.ObjectId(ls)),
      ...actualData,
      createdBy: new Types.ObjectId(creator),
      updatedBy: new Types.ObjectId(creator),
      isDone: false,
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
    const query: any = {};
    
    if (filter.name) {
        query.name = { $regex: filter.name, $options: 'i' };
    }

    if (filter.createdBy) {
        query.createdBy = new Types.ObjectId(filter.createdBy);
    }

    if (filter.startDate && filter.endDate) {
        query.createdAt = {
            $gte: new Date(filter.startDate),
            $lte: new Date(filter.endDate),
        };
    }

    const modules = await ModuleModel.find(query)
        .skip(offset)
        .limit(limit)
        .populate("lessonSet")
        .sort({ createdAt: -1 });

    return modules;
}

}
