import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Request,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ServerErrorResponse,
  ServerSuccessResponse,
} from '../common/entities/responses.entity';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';
import { ModulesService } from './module.service';
import { CreateModuleDto, UpdateModuleDto, DeletModuleDto } from './module.dto';
import { IModulesDoc } from '@repo/models';

@Controller({
  path: 'modules',
  version: '1',
})
export class ModulesController {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly jwt: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAllModules(
    @Query('limit') rawLimit: string,
    @Query('offset') rawOffset: string,
    @Query('filter') rawFilter: string,
  ) {
    try {
      const filter = rawFilter ? JSON.parse(rawFilter) : {};
      const limit = rawLimit ? parseInt(rawLimit, 10) : undefined;
      const offset = rawOffset ? parseInt(rawOffset, 10) : undefined;

      const modules = await this.modulesService.getModules(limit, offset, filter);
      const count = await this.modulesService.getCount(filter);

      return ServerSuccessResponse<{ modules: IModulesDoc[]; count: number }>({
        modules,
        count,
      });
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findModuleById(@Param('id') id: string, @Request() req: any) {
    try {
      const user = req.user;

      if (!user) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      const module = await this.modulesService.getModule(id, user.role);

      if (!module) {
        return ServerErrorResponse(new Error('Module not found'), 404);
      }

      return ServerSuccessResponse(module);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async createModule(
    @Body() createModuleDto: CreateModuleDto,
    @Request() req: any,
  ) {
    try {
      const creator = await this.jwt.validateToken(createModuleDto.authToken);

      if (!creator) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      if (creator.role !== 'SUDO') {
        return ServerErrorResponse(new Error('Unauthorized'), 403);
      }

      const newModule = await this.modulesService.createModule(
        createModuleDto,
        `${creator._id}`,
      );

      console.log('Created module', newModule._id);
      return ServerSuccessResponse(newModule);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateModule(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    try {
      if (!updateModuleDto.authToken) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      const updater = await this.jwt.validateToken(updateModuleDto.authToken);

      if (!updater) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      if (!['SUDO', 'ADMINISTRATOR'].includes(updater.role)) {
        return ServerErrorResponse(new Error('Unauthorized'), 403);
      }

      const updatedModule = await this.modulesService.updateModule(
        id,
        updateModuleDto,
        `${updater._id}`,
      );

      if (!updatedModule) {
        return ServerErrorResponse(new Error('Module not found'), 404);
      }

      console.log('Updated module', updatedModule._id);
      return ServerSuccessResponse(updatedModule);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteModule(@Param('id') id: string, @Body() deleteModuleDto: DeletModuleDto) {
    try {
      if (!deleteModuleDto.authToken) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      const actor = await this.jwt.validateToken(deleteModuleDto.authToken);

      if (!actor) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      if (actor.role !== 'SUDO') {
        return ServerErrorResponse(new Error('Unauthorized'), 403);
      }

      const deletedModule = await this.modulesService.deleteModule(id, `${actor._id}`);

      if (!deletedModule) {
        return ServerErrorResponse(new Error('Module not found'), 404);
      }

      console.log('Deleted module', deletedModule._id);
      return ServerSuccessResponse(deletedModule);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id/lesson-sets')
  async getLessonSetsByModuleId(@Param('id') id: string, @Request() req: any) {
    try {
      const user = req.user;

      if (!user) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      const lessonSets = await this.modulesService.getLessonSetsByModuleId(
        id,
        user.role,
      );

      if (!lessonSets) {
        return ServerErrorResponse(new Error('Lesson Sets not found'), 404);
      }

      return ServerSuccessResponse(lessonSets);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }
}
