import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IlessonDoc } from '@repo/models'
import { CreateLessonDto, UpdateLessonDto } from './lessons.dto';
import { LessonSetsService } from '../common/services/lessonsets.service';
import { CompletedLessonsService } from '../common/services/completedlessons.service';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel('Lesson') private lessonModel: Model<IlessonDoc>,
    private readonly lessonSetsService: LessonSetsService,
    private readonly completedLessonsService: CompletedLessonsService,
  ) {}

  async createLesson(createLessonDto: CreateLessonDto, userRole: string) {
    if (!['ADMIN', 'SUDO'].includes(userRole)) {
      throw new UnauthorizedException('Unauthorized');
    }

    const lessonSet = await this.lessonSetsService.getLessonSetById(createLessonDto.lessonSet);
    if (!lessonSet) {
      throw new Error('LessonSet not found');
    }

    const newLesson = new this.lessonModel(createLessonDto);
    await newLesson.save();
    return newLesson;
  }

  async findAllLessons() {
    return this.lessonModel.find().exec();
  }

  async findLessonById(id: string) {
    return this.lessonModel.findById(id).exec();
  }

  async updateLesson(id: string, updateLessonDto: UpdateLessonDto, userRole: string) {
    if (!['ADMIN', 'SUDO'].includes(userRole)) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.lessonModel.findByIdAndUpdate(id, updateLessonDto, { new: true }).exec();
  }

  async deleteLesson(id: string, userRole: string) {
    if (!['ADMIN', 'SUDO'].includes(userRole)) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.lessonModel.findByIdAndDelete(id).exec();
  }
}
