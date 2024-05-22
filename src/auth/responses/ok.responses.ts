import { ApiProperty } from '@nestjs/swagger';

export class LoginOkResponse {
  @ApiProperty({ example: 'Пользователь авторизован' })
  message = 'Пользователь авторизован';
}

export class RegistrationOkResponse {
  @ApiProperty({ example: 'Пользователь зарегистрирован' })
  message = 'Пользователь зарегистрирован';
}

export class LogoutOkResponse {
  @ApiProperty({ example: 'Пользователь вышел из своей сессии' })
  message = 'Пользователь вышел из своей сессии';
}

export class FullLogoutOkResponse {
  @ApiProperty({ example: 'Пользователь вышел из всех сессий' })
  message = 'Пользователь вышел из всех сессий';
}

export class RefreshOkResponse {
  @ApiProperty({ example: 'access_token обновлён' })
  message = 'access_token и refresh_token обновлены';
}
