import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeStatusDto {
  @ApiProperty({ example: [1], description: 'id задач' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  ids: number[];

  @ApiProperty({ example: true, description: 'статус задачи' })
  @IsBoolean()
  completed: boolean;
}
