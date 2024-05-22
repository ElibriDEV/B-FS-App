import { ApiProperty } from '@nestjs/swagger';

export class UserDeletedResponse {
  @ApiProperty({ example: 'Пользователь 1 удален.' })
  message: string;

  constructor(id: number) {
    this.message = `Пользователь ${id} удален.`;
  }
}
