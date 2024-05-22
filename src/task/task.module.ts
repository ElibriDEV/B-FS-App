import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserModule } from '../user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskModel } from './task.model';

@Module({
  providers: [TaskService],
  imports: [UserModule, SequelizeModule.forFeature([TaskModel])],
  controllers: [TaskController],
})
export class TaskModule {}
