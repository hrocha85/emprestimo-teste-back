import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://emprestimo-teste-front.vercel.app/', // ou o domínio do seu frontend
    methods: 'GET,POST,PUT,DELETE',  // ou os métodos HTTP que você deseja permitir
    allowedHeaders: 'Content-Type, Authorization', // ou os headers que você deseja permitir
  });
  
  await app.listen(3001);
}
bootstrap();
