import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'test@email.com', description: 'Почта' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'qwerty12', description: 'Пароль' })
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
