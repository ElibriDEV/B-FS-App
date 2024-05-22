import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

enum AscDescFields {
  'id' = 'id',
  'title' = 'title',
  'deadline' = 'deadline',
  'completed' = 'completed',
  'updatedAt' = 'updatedAt',
}

export class PaginationTaskDto {
  @ApiPropertyOptional({ example: ['id'], enum: AscDescFields, isArray: true, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ascFields?: string[];

  @ApiPropertyOptional({ example: ['id'], enum: AscDescFields, isArray: true, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  descFields?: string[];
}
