import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateClientDto } from './createClientDto';

@Injectable()
export class ClientsService {
  constructor(@InjectRepository(Client) private clientRepository: Repository<Client>,    @InjectRepository(User)
  private readonly userRepository: Repository<User>,) {}

  async findAll(userId: number): Promise<Client[]> {
    const records = this.clientRepository.find({
      where: {creator: userId},
      relations: ['projects']
    });

    if (records) return await records;

    throw new HttpException({
      status: 404,
      error: 'No clients found',
    }, 404);
  }

  async findOne(id: number, userId: number): Promise<Client> {
    const record = await this.clientRepository.findOne(id, {
      where: {creator: userId},
      relations: ['projects']
    });

    if (record) return record;

    throw new HttpException({
      status: 404,
      error: 'No client found',
    }, 404);
  }

  async create(userId: number, client: CreateClientDto): Promise<Client> {
    const creator = await this.userRepository.findOne({
      where: {id: userId},
      relations: ['clients']
    })

    const newClient = new Client()
    newClient.name = client.name
    newClient.image = client.image
    await newClient.save()


    if (Array.isArray(creator.clients)) {
      creator.clients.push(newClient);
    } else {
      creator.clients = [newClient];
    }

    await this.userRepository.save(creator);

    return newClient;
  }

  async update(client: Client): Promise<UpdateResult> {
    return await this.clientRepository.update(client.id, client);
  }

  async delete(id): Promise<DeleteResult> {
    return await this.clientRepository.delete(id);
  }
}
