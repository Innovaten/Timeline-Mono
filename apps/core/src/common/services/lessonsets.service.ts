// lessonsets.service.ts
import { Injectable } from '@nestjs/common';
import { LessonSetModel, ILessonSetDoc } from '@repo/models';
import { Types } from 'mongoose';
import { CreateLessonSetDto, UpdateLessonSetDto } from '../../lessons/lessonsets.dto';

@Injectable()
export class LessonSetsService {
    async createLessonSet(createLessonSetDto: CreateLessonSetDto): Promise<ILessonSetDoc> {
        const newLessonSet = new LessonSetModel({
            ...createLessonSetDto,
            class: new Types.ObjectId(createLessonSetDto.class),
            lessons: createLessonSetDto.lessons.map((id: string) => new Types.ObjectId(id)),
        });
        await newLessonSet.save();
        return newLessonSet;
    }

    async getLessonSetById(lessonSetId: string): Promise<ILessonSetDoc | null> {
        return LessonSetModel.findById(lessonSetId).exec();
    }

    async updateLessonSet(lessonSetId: string, updateLessonSetDto: UpdateLessonSetDto): Promise<ILessonSetDoc | null> {
        return LessonSetModel.findByIdAndUpdate(
            lessonSetId,
            { ...updateLessonSetDto, lessons: updateLessonSetDto.lessons?.map((id: string) => new Types.ObjectId(id)) },
            { new: true }
        ).exec();
    }

    async deleteLessonSet(lessonSetId: string): Promise<ILessonSetDoc | null> {
        return LessonSetModel.findByIdAndDelete(lessonSetId).exec();
    }
}
