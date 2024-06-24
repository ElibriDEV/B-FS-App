import { IsBoolean, IsDate, IsInt, IsOptional, MaxLength, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор задачи' })
  @IsInt()
  @Min(1)
  id: number;

  @ApiPropertyOptional({ example: 'Новая задача', description: 'Заголовок задачи' })
  @MaxLength(255)
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: 'Описание задачи', description: 'Описание задачи' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: false, description: 'Статус выполнения задачи' })
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({ example: new Date(), description: 'Дата дедлайна задачи' })
  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  deadline?: Date;
}
