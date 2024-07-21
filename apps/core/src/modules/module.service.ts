import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IModulesDoc } from '@repo/models';
import { CreateModuleDto, UpdateModuleDto } from './module.dto';
import { LessonSetsService } from '../common/services/lessonsets.service';
import { CompletedLessonsService } from '../common/services/completedlessons.service';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel('Module') private moduleModel: Model<IModulesDoc>,
    private readonly lessonSetsService: LessonSetsService,
    private readonly completedLessonsService: CompletedLessonsService,
  ) {}

  async createModule(createModuleDto: CreateModuleDto, userRole: string) {
    if (!['ADMIN', 'SUDO'].includes(userRole)) {
      throw new UnauthorizedException('Unauthorized');
    }

    const lessonSets = await Promise.all(createModuleDto.lessonSet.map(id => this.lessonSetsService.getLessonSetById(id)));
    if (lessonSets.some(ls => !ls)) {
      throw new Error('One or more LessonSets not found');
    }

    const newModule = new this.moduleModel(createModuleDto);
    await newModule.save();
    return newModule;
  }

  async findAllModules() {
    return this.moduleModel.find().exec();
  }

  async findModuleById(id: string) {
    return this.moduleModel.findById(id).exec();
  }

  async updateModule(id: string, updateModuleDto: UpdateModuleDto, userRole: string) {
    if (!['ADMIN', 'SUDO'].includes(userRole)) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.moduleModel.findByIdAndUpdate(id, updateModuleDto, { new: true }).exec();
  }

  async deleteModule(id: string, userRole: string) {
    if (!['ADMIN', 'SUDO'].includes(userRole)) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.moduleModel.findByIdAndDelete(id).exec();
  }
}
