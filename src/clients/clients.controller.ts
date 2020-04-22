import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './client.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateClientDto } from './createClientDto';
import {diskStorage} from 'multer'
import { editFileName, imageFileFilter } from '../utils/constances';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  index(@User('id') userId: number): Promise<Client[]> {
    return this.clientsService.findAll(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  show(@Param('id') id, @User('id') userId: number): Promise<Client> {
    return this.clientsService.findOne(id, userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UseInterceptors(FileInterceptor('image',  {
    storage: diskStorage({
      destination: './uploads/clients',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async create(@User('id') userId: number, @UploadedFile() image, @Body() clientData: CreateClientDto): Promise<any> {
    if(image) clientData.image = image.filename
    return this.clientsService.create(userId, clientData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/update')
  async update(@Param('id') id, @Body() clientData: Client) {
    clientData.id = Number(id);
    return this.clientsService.update(clientData)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/delete')
  async delete(@Param('id') id): Promise<any> {
    return this.clientsService.delete(id);
  }
}
