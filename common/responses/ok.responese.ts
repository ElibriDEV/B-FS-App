import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { Model } from 'sequelize-typescript';

export class OkResponse {
  @ApiProperty({ example: HttpStatus.OK })
  statusCode: number = HttpStatus.OK;

  @ApiProperty({
    example: 'Successfully',
  })
  message: string;

  constructor(message?: string) {
    if (message) {
      this.message = message;
    } else {
      this.message = 'Successfully';
    }
  }
}

export class OkPagginationResponse {
  @ApiProperty({ example: HttpStatus.OK })
  statusCode?: number = HttpStatus.OK;

  @ApiProperty({
    example: 'Successfully',
  })
  message?: string;

  @ApiProperty({ example: 1 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: '[model table will be here]' })
  rows: Model[];

  constructor(message?: string) {
    if (message) {
      this.message = message;
    } else {
      this.message = 'Successfully';
    }
  }
}
