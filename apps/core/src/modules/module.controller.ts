import { Body, Controller, Get, Query, Post, Request, UseGuards, Patch, Param, Delete, Req } from '@nestjs/common';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { AuthGuard } from '../common/guards/jwt.guard';
import { JwtService } from '../common/services/jwt.service';
import { ModulesService } from './module.service';
import { CreateModuleDto, UpdateModuleDto } from './module.dto';
import { IModuleDoc } from '@repo/models';

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
      const limit = rawLimit ? parseInt(rawLimit) : undefined;
      const offset = rawOffset ? parseInt(rawOffset) : undefined;

      const modules = await this.modulesService.getModules(limit, offset, filter);
      const count = await this.modulesService.getCount(filter);

      return ServerSuccessResponse<{ modules: IModuleDoc[]; count: number }>({
        modules,
        count,
      });
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':specifier')
  async findModuleById(
    @Param('specifier') specifier: string, 
    @Query('isId') isId: string = "True",
    @Request() req: any
  ) {
    try {
      const user = req.user;
      const IsId = isId === "True"

      if (!user) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      const module = await this.modulesService.getModule(specifier, IsId);
      return ServerSuccessResponse(module);

    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }
  
  @UseGuards(AuthGuard)
  @Get(':classCode/modules')
  async findModulesByClassCode(
    @Param('classCode') specifier: string, 
    @Request() req: any,
    @Query('limit') rawLimit: string,
    @Query('offset') rawOffset: string,
    @Query('filter') rawFilter: string,
  ) {
    try {
      const user = req.user;
      const filter = rawFilter ? JSON.parse(rawFilter) : {};
      const limit = rawLimit ? parseInt(rawLimit) : undefined;
      const offset = rawOffset ? parseInt(rawOffset) : undefined;
      console.log("specifier:", specifier)

      if (!user) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      const module = await this.modulesService.getModulesByClass(specifier);
      return ServerSuccessResponse(module);

    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':classCode/count')
  async countModulesByClassCode(
    @Param('classCode') classCode: string,
    @Query('filter') rawFilter: string,
  ) {
    try {
      const filter = rawFilter ? JSON.parse(rawFilter) : {};

      const count = await this.modulesService.getModuleCountByClass(classCode);

      return ServerSuccessResponse(count);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }
  
  @Post()
  async createModule(
    @Body() createModuleDto: CreateModuleDto,
  ) {
    try {
      const creator = await this.jwt.validateToken(createModuleDto.authToken);

      if (!creator) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      const newModule = await this.modulesService.createModule(
        createModuleDto,
        `${creator._id}`,
      );

      console.log('Created module', newModule.code);
      return ServerSuccessResponse(newModule);

    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

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

      if (!['SUDO', 'ADMIN'].includes(updater.role)) {
        return ServerErrorResponse(new Error('Unauthorized'), 403);
      }

      const updatedModule = await this.modulesService.updateModule(
        id,
        updateModuleDto,
        `${updater._id}`,
      );

      console.log('Updated module', updatedModule.code);
      return ServerSuccessResponse(updatedModule);

    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteModule(
    @Param('id') id: string,
    @Req() req: any
  ) {
    try {
      
      const actor = req.user
      if (!actor) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      if (actor.role !== 'SUDO' || actor.role !== "ADMIN") {
        return ServerErrorResponse(new Error('Unauthorized'), 403);
      }

      const deletedModule = await this.modulesService.deleteModule(id, `${actor._id}`);

      console.log('Deleted module', deletedModule.code);
      return ServerSuccessResponse(deletedModule);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id/lessons')
  async getLessonSetsByModuleId(
    @Param('id') id: string, 
    @Request() req: any
  ) {
    try {
      const user = req.user;

      if (!user) {
        return ServerErrorResponse(new Error('Unauthenticated'), 401);
      }

      const lessons = await this.modulesService.getLessonsByModule(id);

      return ServerSuccessResponse(lessons);
      
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }
}
