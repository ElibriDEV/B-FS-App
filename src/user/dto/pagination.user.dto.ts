import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

enum AscDescFields {
  'id' = 'id',
  'firstName' = 'firstName',
  'lastName' = 'lastName',
  'email' = 'email',
  'createdAt' = 'createdAt',
  'updatedAt' = 'updatedAt',
}

export class PaginationUserDto {
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
