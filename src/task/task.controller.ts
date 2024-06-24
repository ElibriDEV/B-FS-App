import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { PaginationTaskDto } from './dto/pagination-task.dto';
import { RequestUser } from '../../common/decorators/request-user.decorator';
import { AccessPayloadInterface } from '../auth/interfaces/access.payload.interface';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { NotFoundResponse } from '../../common/responses/not-found.response';
import { UnprocessableEntityResponse } from '../../common/responses/validation.response';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PaginatedTaskResponse } from './responses/pagination.response';
import { BaseTaskResponse } from './responses/base.response';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ChangeStatusDto } from './dto/status-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { TaskDeletedResponse } from './responses/deleted.response';
import { RangeTaskDto } from './dto/range-task.dto';
import { DateTaskDto } from './dto/date-task.dto';

@Controller('task')
@ApiTags('Задачи')
export class TaskController {
  constructor(@Inject(TaskService) private readonly taskService: TaskService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: PaginatedTaskResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: NotFoundResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Post('/get/pagination/:page/:perPage')
  async tasksPagination(
    @Param('page') page: number,
    @Param('perPage') perPage: number,
    @Body() dto: PaginationTaskDto,
    @RequestUser() user: AccessPayloadInterface,
  ): Promise<PaginatedTaskResponse> {
    return this.taskService.getPagination(page, perPage, dto, user);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: BaseTaskResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: NotFoundResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Get('/get/single/:id')
  async taskById(@Param('id') taskId: number, @RequestUser() user: AccessPayloadInterface): Promise<BaseTaskResponse> {
    return this.taskService.getByIdRequest(taskId, user);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: [BaseTaskResponse] })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: NotFoundResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Post('/get/range')
  async getByDateRange(
    @Body() dto: RangeTaskDto,
    @RequestUser() user: AccessPayloadInterface,
  ): Promise<BaseTaskResponse[]> {
    return this.taskService.getByDateRange(dto, user);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: [BaseTaskResponse] })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: NotFoundResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Post('/get/range')
  async getByDate(@Body() dto: DateTaskDto, @RequestUser() user: AccessPayloadInterface): Promise<BaseTaskResponse[]> {
    return this.taskService.getByDate(dto, user);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: BaseTaskResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Post('/create')
  async create(@Body() dto: CreateTaskDto, @RequestUser() user: AccessPayloadInterface): Promise<BaseTaskResponse> {
    return this.taskService.create(dto, user);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: BaseTaskResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: NotFoundResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Patch('/update')
  async update(@Body() dto: UpdateTaskDto, @RequestUser() user: AccessPayloadInterface): Promise<BaseTaskResponse> {
    return this.taskService.update(dto, user);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: [BaseTaskResponse] })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: NotFoundResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Patch('/update/status')
  async updateStatus(
    @Body() dto: ChangeStatusDto,
    @RequestUser() user: AccessPayloadInterface,
  ): Promise<BaseTaskResponse[]> {
    return this.taskService.changeCompleteStatus(dto, user);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: TaskDeletedResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: NotFoundResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Delete('/delete')
  async delete(@Body() dto: DeleteTaskDto, @RequestUser() user: AccessPayloadInterface): Promise<TaskDeletedResponse> {
    return this.taskService.delete(dto, user);
  }
}
