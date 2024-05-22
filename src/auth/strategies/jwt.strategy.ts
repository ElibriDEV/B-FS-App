import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UnauthorizedResponse } from '../../../common/responses/unauthorized.response';
import { AccessPayloadInterface } from '../interfaces/access.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      secretOrKey: configService.get('JWT_ACCESS_KEY'),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'access_token' in req.cookies)
      return req.cookies['access_token'];
    return null;
  }

  async validate(
    payload: AccessPayloadInterface | null,
  ): Promise<AccessPayloadInterface> {
    if (payload === null) throw new UnauthorizedResponse();
    return payload;
  }
}
