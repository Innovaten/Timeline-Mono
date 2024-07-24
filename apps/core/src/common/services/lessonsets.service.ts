import { NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { LessonSetModel, ILessonSetDoc } from '@repo/models';
import { Types } from 'mongoose';
import { CreateLessonSetDto, UpdateLessonSetDto } from '../../lessons/lessonsets.dto';

export class LessonSetsService {

    async createLessonSet(createLessonSetDto: CreateLessonSetDto): Promise<ILessonSetDoc> {
        const { title, class: classId, module } = createLessonSetDto;

        if (!Types.ObjectId.isValid(classId) || !Types.ObjectId.isValid(module)) {
            throw new NotFoundException('Invalid Class ID or Module ID');
        }

        const newLessonSet = new LessonSetModel({
            title,
            class: new Types.ObjectId(classId),
            module: new Types.ObjectId(module),
            lessons: [], 
        });

        await newLessonSet.save();
        return newLessonSet;
    }



    async getLessonSetById(lessonSetId: string): Promise<ILessonSetDoc> {
        if (!Types.ObjectId.isValid(lessonSetId)) {
            throw new NotFoundException('Invalid Lesson Set ID');
        }

        const lessonSet = await LessonSetModel.findById(lessonSetId).exec();
        if (!lessonSet) {
            throw new NotFoundException('Lesson Set not found');
        }

        return lessonSet;
    }


    async getLessonSets(filter: any = {}, limit: number = 10, offset: number = 0): Promise<ILessonSetDoc[]> {
        const query: any = {};

        if (filter.classId) {
            if (!Types.ObjectId.isValid(filter.classId)) {
                throw new NotFoundException('Invalid Class ID');
            }
            query.class = new Types.ObjectId(filter.classId);
        }

        if (filter.moduleId) {
            if (!Types.ObjectId.isValid(filter.moduleId)) {
                throw new NotFoundException('Invalid Module ID');
            }
            query.module = new Types.ObjectId(filter.moduleId);
        }

        const lessonSets = await LessonSetModel.find(query)
            .skip(offset)
            .limit(limit)
            .populate('module')
            .sort({ createdAt: -1 })
            .exec();

        return lessonSets;
    }


    async updateLessonSet(lessonSetId: string, updateLessonSetDto: UpdateLessonSetDto): Promise<ILessonSetDoc | null > {
        if (!Types.ObjectId.isValid(lessonSetId)) {
            throw new NotFoundException('Invalid Lesson Set ID');
        }

        const existingLessonSet = await LessonSetModel.findById(lessonSetId).exec();
        if (!existingLessonSet) {
            throw new NotFoundException('Lesson Set not found');
        }

        // Ensure lessons are not set to null
        const updatedData: any = { ...updateLessonSetDto };
        if (updateLessonSetDto.lessons !== undefined) {
            updatedData.lessons = updateLessonSetDto.lessons.map((id: string) => new Types.ObjectId(id));
        }

        const updatedLessonSet = await LessonSetModel.findByIdAndUpdate(
            lessonSetId,
            updatedData,
            { new: true }
        ).exec();

        return updatedLessonSet;
    }

    async deleteLessonSet(lessonSetId: string): Promise<ILessonSetDoc> {
        if (!Types.ObjectId.isValid(lessonSetId)) {
            throw new NotFoundException('Invalid Lesson Set ID');
        }

        const deletedLessonSet = await LessonSetModel.findByIdAndDelete(lessonSetId).exec();
        if (!deletedLessonSet) {
            throw new NotFoundException('Lesson Set not found');
        }

        return deletedLessonSet;
    }


    async findByModuleId(moduleId: string): Promise<ILessonSetDoc[]> {
        if (!Types.ObjectId.isValid(moduleId)) {
            throw new NotFoundException('Invalid Module ID');
        }

        const lessonSets = await LessonSetModel.find({ module: new Types.ObjectId(moduleId) }).exec();

        if (!lessonSets || lessonSets.length === 0) {
            throw new NotFoundException('No lesson sets found for the specified module');
        }

        return lessonSets;
    }
}
