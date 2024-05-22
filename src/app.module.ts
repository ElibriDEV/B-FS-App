import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [],
      autoLoadModels: true,
      dialectOptions: {
        useUTC: false,
      },
      timezone: '+06:00',
      logging: false,
    }),
    TaskModule,
    UserModule,
    AuthModule,
  ],
  providers: [],
  exports: [],
  controllers: [],
})
export class AppModule {}
