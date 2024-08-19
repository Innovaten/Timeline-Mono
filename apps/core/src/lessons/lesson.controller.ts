import { Controller, Get, Post, Put, Delete, Param, Body, Request, Query, UseGuards, UnauthorizedException, Patch } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from './lessons.dto';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';

@Controller({
  path: 'lessons',
  version: '1',
})
export class LessonsController {

  constructor(
    private readonly lessonsService: LessonsService,
    private jwt: JwtService,
  ) {}

  @Post()
  async createLesson(
    @Body() createLessonDto: CreateLessonDto, 
  ) {
    try {
      const creator = await this.jwt.validateToken(createLessonDto.authToken);
      if(!creator){
        throw new UnauthorizedException()
      }

      const newLesson = await this.lessonsService.createLesson(createLessonDto, creator);
      return ServerSuccessResponse(newLesson);

    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAllLessons(
    @Query('limit') rawLimit: string,
    @Query('offset') rawOffset: string,
    @Query('filter') rawFilter: string,
  ) {  
  try {
      let filter = rawFilter ? JSON.parse(rawFilter) : {}
      let limit;
      let offset;

      if(rawLimit){
          limit = parseInt(rawLimit);
      }

      if(rawOffset){
          offset = parseInt(rawOffset)
      }

      const lessons = await this.lessonsService.findAllLessons(filter, limit, offset);
      return ServerSuccessResponse(lessons);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':specifier')
  async findLessonById(
    @Param('specifier') specifier: string,
    @Query('isId') isId: string = "true",
  ) {
    try {
      const IsId = isId == "true";
      const lesson = await this.lessonsService.findLessonById(specifier, IsId);
      return ServerSuccessResponse(lesson);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @Patch(':id')
  async updateLesson(
    @Param('id') id: string, 
    @Body() updateLessonDto: UpdateLessonDto, 
    @Request() req: any 
  ) {
    try {
      if(!updateLessonDto.authToken){
        throw new UnauthorizedException();
      }

      
      const actor = await this.jwt.validateToken(updateLessonDto.authToken);
      if(!actor){
        throw new UnauthorizedException()
      }
      const updatedLesson = await this.lessonsService.updateLesson(id, updateLessonDto, actor);
      return ServerSuccessResponse(updatedLesson);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
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
