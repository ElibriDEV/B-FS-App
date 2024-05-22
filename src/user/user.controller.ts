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
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { NotFoundResponse } from '../../common/responses/not-found.response';
import { UnprocessableEntityResponse } from '../../common/responses/validation.response';
import { UserBaseResponse } from './responses/base.response';
import { PaginationUserDto } from './dto/pagination.user.dto';
import { PaginatedUserResponse } from './responses/pagination.response';
import { PaginatedTaskResponse } from '../task/responses/pagination.response';
import { UpdateUserDto } from './dto/update.user.dto';
import { RequestUser } from '../../common/decorators/request-user.decorator';
import { AccessPayloadInterface } from '../auth/interfaces/access.payload.interface';
import { UserDeletedResponse } from './responses/deleted.response';

@Controller('user')
@ApiTags('Пользователь')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: UserBaseResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: NotFoundResponse })
  @Get('/self')
  async getSelf(@RequestUser() user: AccessPayloadInterface): Promise<UserBaseResponse> {
    return this.userService.getSelf(user);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: UserBaseResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: NotFoundResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Get('/get/single/:id')
  async getById(@Param('id') userId: number): Promise<UserBaseResponse> {
    return this.userService.getById(userId);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: PaginatedTaskResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: NotFoundResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Post('/get/pagination/:page/:perPage')
  async getPagination(
    @Body() dto: PaginationUserDto,
    @Param('page') page: number,
    @Param('perPage') perPage: number,
  ): Promise<PaginatedUserResponse> {
    return this.userService.getPagination(page, perPage, dto);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: UserBaseResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Patch('/self')
  async updateSelf(@Body() dto: UpdateUserDto, @RequestUser() user: AccessPayloadInterface): Promise<UserBaseResponse> {
    return this.userService.updateSelf(dto, user);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success', type: UserDeletedResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @ApiUnprocessableEntityResponse({ description: 'Error: Unprocessable Entity', type: UnprocessableEntityResponse })
  @Delete('/self')
  async deleteSelf(@RequestUser() user: AccessPayloadInterface): Promise<UserDeletedResponse> {
    return this.userService.deleteSelf(user);
  }
}
