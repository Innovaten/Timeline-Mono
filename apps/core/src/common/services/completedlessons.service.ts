import { Injectable } from '@nestjs/common';
import { CompletedLessonsModel, ICompletedLessonsDoc } from '@repo/models';
import { Types } from 'mongoose';
import { CreateCompletedLessonDto, UpdateCompletedLessonDto } from '../../lessons/completedlessons.dto';


@Injectable()
export class CompletedLessonsService {
    async createCompletedLesson(createCompletedLessonDto: CreateCompletedLessonDto): Promise<ICompletedLessonsDoc> {
        const newCompletedLesson = new CompletedLessonsModel({
            ...createCompletedLessonDto,
            user: new Types.ObjectId(createCompletedLessonDto.user),
            lessons: createCompletedLessonDto.lessons.map((id: string) => new Types.ObjectId(id)),
        });
        await newCompletedLesson.save();
        return newCompletedLesson;
    }

    async getCompletedLessonById(completedLessonId: string): Promise<ICompletedLessonsDoc | null> {
        return CompletedLessonsModel.findById(completedLessonId).exec();
    }

    async updateCompletedLesson(completedLessonId: string, updateCompletedLessonDto: UpdateCompletedLessonDto): Promise<ICompletedLessonsDoc | null> {
        return CompletedLessonsModel.findByIdAndUpdate(
            completedLessonId,
            {
                ...updateCompletedLessonDto,
                user: updateCompletedLessonDto.user && new Types.ObjectId(updateCompletedLessonDto.user),
                lessons: updateCompletedLessonDto.lessons?.map((id: string) => new Types.ObjectId(id)),
            },
            { new: true }
        ).exec();
    }

    async deleteCompletedLesson(completedLessonId: string): Promise<ICompletedLessonsDoc | null> {
        return CompletedLessonsModel.findByIdAndDelete(completedLessonId).exec();
    }
}
