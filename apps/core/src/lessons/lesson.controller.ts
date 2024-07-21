import { Controller, Get, Post, Put, Delete, Param, Body, Request } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from './lessons.dto';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  async createLesson(@Body() createLessonDto: CreateLessonDto, @Request() req: any) {
    try {
      const userRole = req.user.role;
      const newLesson = await this.lessonsService.createLesson(createLessonDto, userRole);
      return ServerSuccessResponse(newLesson);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @Get()
  async findAllLessons() {
    try {
      const lessons = await this.lessonsService.findAllLessons();
      return ServerSuccessResponse(lessons);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @Get(':id')
  async findLessonById(@Param('id') id: string) {
    try {
      const lesson = await this.lessonsService.findLessonById(id);
      return ServerSuccessResponse(lesson);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @Put(':id')
  async updateLesson(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto, @Request() req: any) {
    try {
      const userRole = req.user.role;
      const updatedLesson = await this.lessonsService.updateLesson(id, updateLessonDto, userRole);
      return ServerSuccessResponse(updatedLesson);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @Delete(':id')
  async deleteLesson(@Param('id') id: string, @Request() req: any) {
    try {
      const userRole = req.user.role;
      const deletedLesson = await this.lessonsService.deleteLesson(id, userRole);
      return ServerSuccessResponse(deletedLesson);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }
}
