import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTaskDto {
  @ApiProperty({ example: [1], description: 'id задач' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  ids: number[];
}
