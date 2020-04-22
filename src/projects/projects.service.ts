import {HttpException, Injectable, UseGuards} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Project} from './project.entity';
import {DeleteResult, Repository, UpdateResult} from 'typeorm';
import {User} from '../users/user.entity';
import {CreateProjectDto} from './createProjectDto';
import {Client} from "../clients/client.entity";

@Injectable()
export class ProjectsService {
    constructor(@InjectRepository(Project) private projectRepository: Repository<Project>, @InjectRepository(User)
    private readonly userRepository: Repository<User>, @InjectRepository(Client)
                private readonly clientRepository: Repository<Client>) {
    }

    async findAll(userId: number): Promise<Project[]> {
        const records = this.projectRepository.find({
            where: {creator: userId},
            relations: ['client']
        });

        if (records) return await records;

        throw new HttpException({
            status: 404,
            error: 'No projects found',
        }, 404);
    }

    async findOne(id: number, userId: number): Promise<Project> {
        const record = await this.projectRepository.findOne(id, {
            where: {creator: userId},
            relations: ['client']
        });

        if (record) return record;

        throw new HttpException({
            status: 404,
            error: 'No project found',
        }, 404);
    }

    async create(userId: number, project: CreateProjectDto): Promise<Project> {
        const creator = await this.userRepository.findOne({
            where: {id: userId},
            relations: ['projects']
        })

        const client = await this.clientRepository.findOne({
            where: {id: project.client}
        })

        const newProject = new Project()
        newProject.name = project.name
        newProject.description = project.description
        newProject.deadline = project.deadline

        if (Array.isArray(creator.projects)) {
            creator.projects.push(newProject);
        } else {
            creator.projects = [newProject];
        }

        if (Array.isArray(client.projects)) {
            client.projects.push(newProject);
        } else {
            client.projects = [newProject];
        }

        await this.userRepository.save(creator);
        await this.clientRepository.save(client);

        const record = await this.projectRepository.findOne(newProject.id, {
            where: {creator: userId},
            relations: ['client']
        });

        return record;
    }

    async update(project: Project): Promise<UpdateResult> {
        return await this.projectRepository.update(project.id, project);
    }

    async delete(id): Promise<DeleteResult> {
        return await this.projectRepository.delete(id);
    }
}
