import { AuthGuard } from '@nestjs/passport';

export class JwtAuthExpIgnoreGuard extends AuthGuard('jwt-exp-ignore') {}
