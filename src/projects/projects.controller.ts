import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.decorator';
import { CreateProjectDto } from './createProjectDto';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  index(@User('id') userId: number): Promise<Project[]> {
    return this.projectsService.findAll(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  show(@Param('id') id, @User('id') userId: number): Promise<Project> {
    return this.projectsService.findOne(id, userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@User('id') userId: number, @Body() projectData: CreateProjectDto): Promise<any> {
    return this.projectsService.create(userId, projectData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/update')
  async update(@Param('id') id, @Body() projectData: Project) {
    projectData.id = Number(id);
    return this.projectsService.update(projectData)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/delete')
  async delete(@Param('id') id): Promise<any> {
    return this.projectsService.delete(id);
  }
}
