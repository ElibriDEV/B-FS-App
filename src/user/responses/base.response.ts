import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserBaseResponse {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор пользвоателя' })
  id: number;

  @ApiProperty({ example: 'Имя', description: 'Основное имя' })
  firstName: string;

  @ApiPropertyOptional({ example: 'Фамилия', description: 'Дополнительное имя' })
  lastName: string | null;

  @ApiProperty({ example: 'test@email.com', description: 'Почта' })
  email: string;

  @ApiProperty({ example: new Date(), description: 'Дата создания пользователя' })
  createdAt: Date;

  @ApiProperty({ example: new Date(), description: 'Дата последнего обновления пользователя' })
  updatedAt: Date;
}
