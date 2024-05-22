import { ApiProperty } from '@nestjs/swagger';

export class BaseTaskResponse {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор задачи' })
  id: number;

  @ApiProperty({ example: 'Новая задача', description: 'Заголовок задачи' })
  title: string;

  @ApiProperty({ example: 'Описание новой задачи', description: 'Описание задачи' })
  description: string;

  @ApiProperty({ example: new Date(), description: 'Дата выполнения задачи' })
  deadline: Date;

  @ApiProperty({ example: false, description: 'Статус выполнения задачи' })
  completed: boolean;

  @ApiProperty({ example: 1, description: 'Уникальный идентификатор автора задачи' })
  userId: number;

  @ApiProperty({ example: new Date(), description: 'Дата создания задачи' })
  createdAt: Date;

  @ApiProperty({ example: new Date(), description: 'Дата обновления задачи' })
  updatedAt: Date;
}
