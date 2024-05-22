import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TaskModel } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserService } from '../user/user.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundResponse } from '../../common/responses/not-found.response';
import { ModelManager } from '../../common/utils/model_manager/model.manager';
import { PaginationTaskDto } from './dto/pagination-task.dto';
import { AccessPayloadInterface } from '../auth/interfaces/access.payload.interface';
import { PaginatedTaskResponse } from './responses/pagination.response';
import { BaseTaskResponse } from './responses/base.response';
import { ForbiddenResponse } from '../../common/responses/forbidden.response';
import { ChangeStatusDto } from './dto/status-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { TaskDeletedResponse } from './responses/deleted.response';
import { UserBaseResponse } from '../user/responses/base.response';

@Injectable()
export class TaskService {
  private modelManager: ModelManager<TaskModel>;
  constructor(
    @InjectModel(TaskModel) private readonly taskModel: typeof TaskModel,
    @Inject(UserService) private readonly userService: UserService,
  ) {
    this.modelManager = new ModelManager(TaskModel);
  }

  async getPagination(
    page: number,
    perPage: number,
    dto: PaginationTaskDto,
    tokenPayload: AccessPayloadInterface,
  ): Promise<PaginatedTaskResponse> {
    return this.modelManager.paginateFindAll({
      where: { userId: tokenPayload.id },
      attributes: ['id', 'title', 'description', 'deadline', 'completed', 'userId', 'createdAt', 'updatedAt'],
      page: page,
      perPage: perPage,
      ascKeys: dto.ascFields,
      descKeys: dto.descFields,
    });
  }

  async getByIdRequest(id: number, tokenPayload: AccessPayloadInterface): Promise<BaseTaskResponse> {
    const task: TaskModel = await this.taskModel.findOne({
      where: { id: id, userId: tokenPayload.id },
      attributes: ['id', 'title', 'description', 'deadline', 'completed', 'userId', 'createdAt', 'updatedAt'],
    });
    if (!task) throw new NotFoundResponse(`Task with id ${id} not found.`);
    return task;
  }

  async getById(id: number, raiseException: boolean = true): Promise<BaseTaskResponse> {
    const task: TaskModel = await this.taskModel.findByPk(id, {
      attributes: ['id', 'title', 'description', 'deadline', 'completed', 'userId', 'createdAt', 'updatedAt'],
    });
    if (!task && raiseException) throw new NotFoundResponse(`Task with id ${id} not found.`);
    return task;
  }

  async create(dto: CreateTaskDto, tokenPayload: AccessPayloadInterface): Promise<BaseTaskResponse> {
    const user: UserBaseResponse = await this.userService.getById(tokenPayload.id);
    return this.taskModel.create(
      {
        ...dto,
        userId: user.id,
      },
      { returning: ['id', 'title', 'description', 'deadline', 'completed', 'userId', 'createdAt', 'updatedAt'] },
    );
  }

  async update(dto: UpdateTaskDto, tokenPayload: AccessPayloadInterface): Promise<BaseTaskResponse> {
    const oldTask: BaseTaskResponse = await this.getById(dto.id);
    if (oldTask.userId != tokenPayload.id) {
      throw new ForbiddenResponse();
    }
    return await this.taskModel
      .update(dto, {
        where: { id: oldTask.id },
        returning: ['id', 'title', 'description', 'deadline', 'completed', 'userId', 'createdAt', 'updatedAt'],
      })
      .then(([, tasks]) => tasks[0]);
  }

  async changeCompleteStatus(dto: ChangeStatusDto, tokenPayload: AccessPayloadInterface): Promise<BaseTaskResponse[]> {
    await this.modelManager.multipleIdExistsCheck(dto.ids, { where: { id: dto.ids, userId: tokenPayload.id } });
    return this.taskModel
      .update(
        { completed: dto.completed },
        {
          where: { id: dto.ids },
          returning: ['id', 'title', 'description', 'deadline', 'completed', 'userId', 'createdAt', 'updatedAt'],
        },
      )
      .then(([, tasks]) => tasks);
  }

  async delete(dto: DeleteTaskDto, tokenPayload: AccessPayloadInterface): Promise<TaskDeletedResponse> {
    await this.modelManager.multipleIdExistsCheck(dto.ids, { where: { id: dto.ids, userId: tokenPayload.id } });
    await this.taskModel.destroy({ where: { id: dto.ids } });
    return new TaskDeletedResponse(dto.ids);
  }
}
