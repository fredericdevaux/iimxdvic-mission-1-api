import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ClientsModule} from './clients/clients.module';
import {ConfigModule} from './config/config.module';
import {ConfigService} from './config/config.service';
import {TypeOrmModule, TypeOrmModuleAsyncOptions} from '@nestjs/typeorm';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {MulterModule} from '@nestjs/platform-express';
import {ProjectsModule} from "./projects/projects.module";

@Module({
    imports: [
        ClientsModule,
        ProjectsModule,
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    name: 'default',
                    type: configService.get('DB_TYPE'),
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [__dirname + '/**/**.entity{.ts,.js}'],
                    synchronize: configService.get('DB_SYNC'),
                    cache: {
                        type: configService.get('DB_CACHE_DRIVER'),
                        options: {
                            host: configService.get('DB_CACHE_HOST'),
                            port: configService.get('DB_CACHE_PORT'),
                        },
                    },
                } as TypeOrmModuleAsyncOptions;
            },
        }),
        MulterModule.register({
            dest: './uploads'
        }),
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
