## Запуск приложения

### .development.env или .production.env
```
PORT=5000
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_DB=database
POSTGRES_PASSWORD=root
POSTGRES_PORT=5432

JWT_ACCESS_KEY=SECRET
JWT_REFRESH_KEY=SECRET1
```

### Запуск Docker-окружения
```sh
$ docker-compose -f local-compose.yml up
```

### Запуск приложения

#### Установка зависимостей
```sh
$ npm i
```

#### Запуск в dev-режиме (чтение .development.env)
```sh
$ npm run start:dev
```

#### Запуск в prod-режиме (чтение .production.env)
```sh
$ npm run start
```
