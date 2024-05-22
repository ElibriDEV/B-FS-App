import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Имя', description: 'Основное имя' })
  @MinLength(2)
  @MaxLength(32)
  firstName: string;

  @ApiPropertyOptional({
    example: 'Фамилия',
    description: 'Дополнительное имя',
  })
  @IsOptional()
  @MinLength(2)
  @MaxLength(32)
  lastName?: string;

  @ApiProperty({ example: 'test@email.com', description: 'Почта' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'qwerty12', description: 'Пароль' })
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
