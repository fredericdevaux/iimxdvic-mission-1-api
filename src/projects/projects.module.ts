import {Module} from '@nestjs/common';
import {ProjectsController} from './projects.controller';
import {ProjectsService} from './projects.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Project} from './project.entity';
import {UsersModule} from '../users/users.module';
import {UsersService} from '../users/users.service';
import {User} from '../users/user.entity';
import {ClientsModule} from "../clients/clients.module";
import {Client} from "../clients/client.entity";
import {ClientsService} from "../clients/clients.service";

@Module({
    imports: [
        UsersModule,
        ClientsModule,
        TypeOrmModule.forFeature([Project, User, Client]),
    ],
    controllers: [ProjectsController],
    providers: [ProjectsService, UsersService, ClientsService],
    exports: [ProjectsService]
})
export class ProjectsModule {
}
