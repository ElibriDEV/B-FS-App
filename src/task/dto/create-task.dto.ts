import { IsBoolean, IsDate, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Новая задача', description: 'Заголовок задачи' })
  @MaxLength(255)
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ example: 'Описание задачи', description: 'Описание задачи' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: false, description: 'Статус выполнения задачи' })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({ example: new Date(), description: 'Дата дедлайна задачи' })
  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  deadline?: Date;
}
