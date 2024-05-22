import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  providers: [UserService],
  imports: [SequelizeModule.forFeature([UserModel])],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
