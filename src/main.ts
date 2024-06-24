import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT: number = Number(process.env.PORT) || 5000;
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:3000', credentials: true },
  });

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const config = new DocumentBuilder().setTitle('API: B-FS-Application').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Server has been started on port: ${PORT}`);
    console.log(`API docs: http://localhost:${PORT}/docs#/`);
  });
}

bootstrap();
