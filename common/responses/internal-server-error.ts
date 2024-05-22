import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class InternalServerErrorResponse {
  @ApiProperty({ example: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

  @ApiProperty({ example: 'Internal Server Error', description: 'Error message (Any type)' })
  message: Array<any> | string | Record<string, any>;

  constructor(message?: Array<any> | string | Record<string, any>) {
    if (message) {
      this.message = message;
    } else {
      this.message = 'Internal Server Error';
    }
  }
}
