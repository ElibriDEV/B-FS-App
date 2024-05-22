import { ApiProperty } from '@nestjs/swagger';

export class TaskDeletedResponse {
  @ApiProperty({ example: 'Задачи 1, 2, 3 удалены' })
  message: string;

  constructor(ids: number[]) {
    if (ids.length == 1) {
      this.message = `Задача ${ids} удалена`;
    } else {
      this.message = `Задачи ${ids} удалены`;
    }
  }
}
