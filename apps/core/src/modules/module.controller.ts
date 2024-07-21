import { Controller, Get, Post, Put, Delete, Param, Body, Request } from '@nestjs/common';
import { ModulesService } from './module.service';
import { CreateModuleDto, UpdateModuleDto } from './module.dto';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  async createModule(@Body() createModuleDto: CreateModuleDto, @Request() req: any) {
    try {
      const userRole = req.user.role;
      const newModule = await this.modulesService.createModule(createModuleDto, userRole);
      return ServerSuccessResponse(newModule);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @Get()
  async findAllModules() {
    try {
      const modules = await this.modulesService.findAllModules();
      return ServerSuccessResponse(modules);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @Get(':id')
  async findModuleById(@Param('id') id: string) {
    try {
      const module = await this.modulesService.findModuleById(id);
      return ServerSuccessResponse(module);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @Put(':id')
  async updateModule(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto, @Request() req: any) {
    try {
      const userRole = req.user.role;
      const updatedModule = await this.modulesService.updateModule(id, updateModuleDto, userRole);
      return ServerSuccessResponse(updatedModule);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }

  @Delete(':id')
  async deleteModule(@Param('id') id: string, @Request() req: any) {
    try {
      const userRole = req.user.role;
      const deletedModule = await this.modulesService.deleteModule(id, userRole);
      return ServerSuccessResponse(deletedModule);
    } catch (err) {
      return ServerErrorResponse(new Error(`${err}`), 500);
    }
  }
}
