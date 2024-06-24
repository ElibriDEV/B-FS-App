import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestUser } from '../../common/decorators/request-user.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConflictResponse } from '../../common/responses/conflict.response';
import { BadRequestResponse } from '../../common/responses/bad-request.response';
import { UserModel } from '../user/user.model';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { FullLogoutOkResponse, LoginOkResponse, LogoutOkResponse, RefreshOkResponse } from './responses/ok.responses';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AccessPayloadInterface } from './interfaces/access.payload.interface';
import { UserBaseResponse } from '../user/responses/base.response';
import { JwtAuthExpIgnoreGuard } from './guards/jwt-ext-ignore.guard';

@Controller('auth')
@ApiTags('Авторизация')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Регистрация' })
  @ApiOkResponse({ type: UserModel })
  @ApiBadRequestResponse({ description: 'Error: Validation', type: BadRequestResponse })
  @ApiConflictResponse({ description: 'Error: Conflict', type: ConflictResponse })
  @Post('/register')
  async registration(@Body() dto: CreateUserDto): Promise<UserBaseResponse> {
    return await this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Вход' })
  @ApiOkResponse({ type: LoginOkResponse })
  @ApiBadRequestResponse({ description: 'Error: Validation', type: BadRequestResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedResponse })
  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response): Promise<Response> {
    return await this.authService.login(dto, res);
  }

  @UseGuards(JwtRefreshGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Выход' })
  @ApiOkResponse({ type: LogoutOkResponse })
  @Get('/logout')
  async logout(@Res() res: Response): Promise<Response> {
    return this.authService.logout(res);
  }

  @UseGuards(JwtRefreshGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Выход со всех устройств' })
  @ApiOkResponse({ type: FullLogoutOkResponse })
  @Get('/full-logout')
  async fullLogout(@RequestUser() user: AccessPayloadInterface, @Res() res: Response): Promise<Response> {
    return await this.authService.fullLogout(user.id, res);
  }

  @UseGuards(JwtRefreshGuard, JwtAuthExpIgnoreGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Обновление пары токенов' })
  @ApiOkResponse({ type: RefreshOkResponse })
  @ApiUnauthorizedResponse({
    description: 'Error: Unauthorized',
    type: UnauthorizedResponse,
  })
  @Get('/refresh')
  async refresh(
    @RequestUser() user: AccessPayloadInterface,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.authService.refresh(user.id, req, res);
  }
}
