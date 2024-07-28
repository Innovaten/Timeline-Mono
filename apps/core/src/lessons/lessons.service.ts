import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { IUserDoc, IlessonDoc, ModuleModel } from '@repo/models'
import { CreateLessonDto, UpdateLessonDto } from './lessons.dto';
import { LessonModel } from '@repo/models';
import { generateCode } from '../utils';

@Injectable()
export class LessonsService {
  constructor () {}

  async createLesson(createLessonDto: CreateLessonDto, user: IUserDoc): Promise<IlessonDoc> {

    const timestamp = new Date()

    if (!['ADMIN', 'SUDO'].includes(user.role)) {
      throw new UnauthorizedException('Unauthorized');
    }

    const relatedModule = await ModuleModel.findOne({ code: createLessonDto.moduleCode });

    if(!relatedModule){
      throw new BadRequestException("Related module could not be found")
    }

    const newLesson = new LessonModel({
      code: await generateCode( await LessonModel.countDocuments(), "LSN"),
      title: createLessonDto.title,
      content: createLessonDto.content,
      resources: [],
      lessonSet: new Types.ObjectId(relatedModule.lessonSet.toString()),
      meta: {
        isDeleted: false,
      },
      createdBy: new Types.ObjectId(`${user._id}`),
      updatedBy: new Types.ObjectId(`${user._id}`),
      createdAt: timestamp,
      updatedAt: timestamp
    });

    await newLesson.save();
    return newLesson;
  }

  async findAllLessons(filter: Record<string, any>, limit: number = 10, offset: number = 0): Promise<IlessonDoc[]> {
    return await LessonModel.find(filter)
    .limit(limit)
    .skip(offset)
    .populate("createdBy updatedBy resources");
  }

  async findLessonById(specifier: string, isId: boolean): Promise<any> {
    const filter = isId ? { _id: new Types.ObjectId(specifier) } : { code: specifier } ;
   
    return await LessonModel.find(filter).populate("createdBy updatedBy resources");
  }

  async updateLesson(id: string, updateLessonDto: UpdateLessonDto, user: IUserDoc): Promise<any> {
    if (!['ADMIN', 'SUDO'].includes(user.role)) {
      throw new UnauthorizedException('Unauthorized');
    }

    const { authToken, ...actualData } = updateLessonDto;

    return await LessonModel.findByIdAndUpdate(id, 
      {
        ...actualData,
        updatedAt: new Date(),
        updatedBy: new Types.ObjectId(`${user._id}`)
      }, 
      { new: true }
    );
  }

  async deleteLesson(id: string, userRole: string): Promise<any> {
    if (!['ADMIN', 'SUDO'].includes(userRole)) {
      throw new UnauthorizedException('Unauthorized');
    }

    return await LessonModel.findByIdAndUpdate(id, 
      { 
        meta: { 
          isDeleted: true 
        }, 
        updatedAt: new Date() 
      }, 
      { new: true}
    )
  }
}