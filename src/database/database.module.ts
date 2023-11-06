import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          dialect: configService.get('database_dialect'),
          host: configService.get('database_host'),
          port: configService.get('database_port'),
          database: configService.get('database_db'),
          username: configService.get('database_user'),
          password: configService.get('database_password'),
          autoLoadModels: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
