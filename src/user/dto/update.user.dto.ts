import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Имя', description: 'Основное имя' })
  @MinLength(2)
  @MaxLength(32)
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Фамилия',
    description: 'Дополнительное имя',
  })
  @IsOptional()
  @MinLength(2)
  @MaxLength(32)
  lastName?: string;

  @ApiPropertyOptional({ example: 'test@email.com', description: 'Почта' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'qwerty12', description: 'Пароль' })
  @IsOptional()
  @MinLength(8)
  @MaxLength(32)
  password?: string;
}
