import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserModel } from '../user/user.model';
import { ConflictResponse } from '../../common/responses/conflict.response';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { FullLogoutOkResponse, LoginOkResponse, LogoutOkResponse, RefreshOkResponse } from './responses/ok.responses';
import { AccessPayloadInterface } from './interfaces/access.payload.interface';
import { RefreshPayloadInterface } from './interfaces/refresh.payload.interface';
import { UserBaseResponse } from '../user/responses/base.response';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private _setCookiesToken(res: Response, accessToken?: string, refreshToken?: string): void {
    const currentDate: Date = new Date();
    if (accessToken) {
      res.cookie('access_token', accessToken, {
        sameSite: 'lax',
        expires: new Date(currentDate.getTime() + 30 * 60 * 1000),
      });
    }
    if (refreshToken) {
      res.cookie('refresh_token', refreshToken, {
        sameSite: 'lax',
        expires: new Date(currentDate.getTime() + 180 * 24 * 60 * 60 * 1000),
      });
    }
  }

  private async _generateRefreshToken(id: number, date: number): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: id,
        iat: date,
      },
      { secret: this.configService.get('JWT_REFRESH_KEY'), expiresIn: '180d' },
    );
  }

  private async _generateAccessToken(user: UserModel, date: number): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        iat: date,
      },
      { secret: this.configService.get('JWT_ACCESS_KEY'), expiresIn: '30m' },
    );
  }

  async register(dto: CreateUserDto): Promise<UserBaseResponse> {
    const userExists: UserModel = await this.userService.getByEmailFull(dto.email, false);
    if (userExists) throw new ConflictResponse('User already exists');
    return await this.userService.create(dto);
  }

  async login(dto: LoginDto, res: Response): Promise<Response> {
    const userExists: UserModel = await this.userService.getByEmailFull(dto.email, false);
    if (!userExists) throw new UnauthorizedResponse();
    const passwordEquals: boolean = await compare(dto.password, userExists.password);
    if (!passwordEquals) throw new UnauthorizedResponse();
    const date: number = Date.now();
    const refreshToken: string = await this._generateRefreshToken(userExists.id, date);
    const accessToken: string = await this._generateAccessToken(userExists, date);
    await this.userService.upsertRefresh(userExists.id, refreshToken);
    this._setCookiesToken(res, accessToken, refreshToken);
    return res.send(new LoginOkResponse());
  }

  logout(res: Response): Response {
    res.clearCookie('access_token');
    return res.send(new LogoutOkResponse());
  }

  async fullLogout(id: number, res: Response): Promise<Response> {
    await this.userService.upsertRefresh(id, null);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.send(new FullLogoutOkResponse());
  }

  async refresh(id: number, req: Request, res: Response): Promise<Response> {
    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];
    if (!accessToken || !refreshToken) throw new UnauthorizedResponse();
    const user: UserModel = await this.userService.getByIdFull(id);
    if (!user) throw new UnauthorizedResponse();
    const refreshTokenEquals: boolean = await compare(refreshToken, user.refreshToken);
    if (!refreshTokenEquals) throw new UnauthorizedResponse();
    const accessTokenPayload: AccessPayloadInterface = await this.jwtService.verifyAsync(accessToken, {
      ignoreExpiration: true,
    });
    const refreshTokenPayload: RefreshPayloadInterface = await this.jwtService.verifyAsync(accessToken, {
      ignoreExpiration: true,
    });
    if (accessTokenPayload.id != refreshTokenPayload.id || accessTokenPayload.iat != refreshTokenPayload.iat)
      throw new UnauthorizedResponse();
    const date: number = Date.now();
    const newRefreshToken: string = await this._generateRefreshToken(user.id, date);
    const newAccessToken: string = await this._generateAccessToken(user, date);
    await this.userService.upsertRefresh(user.id, newRefreshToken);
    this._setCookiesToken(res, newAccessToken, newRefreshToken);
    return res.send(new RefreshOkResponse());
  }
}
