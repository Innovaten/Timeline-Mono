import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { IUserDoc, ILessonDoc, ModuleModel, LessonSetModel } from '@repo/models'
import { CreateLessonDto, UpdateLessonDto } from './lessons.dto';
import { LessonModel } from '@repo/models';
import { generateCode } from '../utils';

@Injectable()
export class LessonsService {
  constructor () {}

  async createLesson(createLessonDto: CreateLessonDto, user: IUserDoc): Promise<ILessonDoc> {

    const timestamp = new Date()

    if (!['ADMIN', 'SUDO'].includes(user.role)) {
      throw new UnauthorizedException('Unauthorized');
    }

    const relatedModule = await ModuleModel.findOne({ code: createLessonDto.moduleCode });

    if(!relatedModule){
      throw new BadRequestException("Related module could not be found")
    }

    const newLesson = new LessonModel({
      code: await generateCode( await LessonModel.countDocuments({ code: { $regex: /LSN/ }}), "LSN"),
      title: createLessonDto.title,
      content: createLessonDto.content,
      resources: createLessonDto.resources.map( r => new Types.ObjectId(r)),
      lessonSet: new Types.ObjectId(relatedModule.lessonSet.toString()),
      meta: {
        isDeleted: false,
      },
      createdBy: new Types.ObjectId(`${user._id}`),
      updatedBy: new Types.ObjectId(`${user._id}`),
      createdAt: timestamp,
      updatedAt: timestamp
    });


    const relatedLessonSet = await LessonSetModel.findOne({ _id: new Types.ObjectId(relatedModule.lessonSet.toString()) });
    if(!relatedLessonSet){
      throw new BadRequestException("Related lesson set could not be found")
    }
    relatedLessonSet.lessons.push(new Types.ObjectId(newLesson._id.toString()));
    await relatedLessonSet.save();
    await newLesson.save();
    return newLesson;
  }

  async findAllLessons(filter: Record<string, any>, limit: number = 10, offset: number = 0): Promise<ILessonDoc[]> {
    const { moduleCode, ...rest } = filter;
    if(moduleCode){
      const relatedModule = await ModuleModel.findOne({ code: moduleCode })
    const filter = { lessonSet: relatedModule?.lessonSet, ...rest }
    return await LessonModel.find(filter)
    .limit(limit)
    .skip(offset)
    .populate("createdBy updatedBy resources");
    }
    else {
      throw new BadRequestException("Module code is required");
    } 
  }

  async findLessonById(specifier: string, isId: boolean): Promise<any> {
    const filter = { code: specifier } ;
    return await LessonModel.findOne(filter).populate("createdBy updatedBy resources");
  }

  async findLessonByCode(code: string): Promise<any> {  
    return await LessonModel.findOne({ code: code }).populate("createdBy updatedBy resources");
  }

  async updateLesson(id: string, updateLessonDto: UpdateLessonDto, user: IUserDoc): Promise<any> {
    if (!['ADMIN', 'SUDO'].includes(user.role)) {
      throw new UnauthorizedException('Unauthorized');
    }

    const { authToken, ...actualData } = updateLessonDto;
    return await LessonModel.findOneAndUpdate({_id: id}, 
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