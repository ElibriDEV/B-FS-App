import { IsBoolean, IsDate, IsInt, IsOptional, MaxLength, Min, MinDate, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор задачи' })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'Новая задача', description: 'Заголовок задачи' })
  @MaxLength(255)
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: 'Описание задачи', description: 'Описание задачи' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: false, description: 'Статус выполнения задачи' })
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({ example: new Date(), description: 'Дата дедлайна задачи' })
  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  deadline?: Date;
}
