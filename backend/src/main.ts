import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001',
      'http://0.0.0.0:3000',
      'http://0.0.0.0:3001',
      'http://192.168.100.45:3000',
      'http://192.168.100.45:3001',
      // Allow any IP in the 192.168.x.x range for development
      /^http:\/\/192\.168\.\d+\.\d+:(3000|3001)$/,
      // Allow 0.0.0.0 for development
      /^http:\/\/0\.0\.0\.0:(3000|3001)$/
    ],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Music Playlist API')
    .setDescription('API documentation for the Music Playlist Application')
    .setVersion('1.0')
    .addTag('tracks', 'Track management endpoints')
    .addTag('playlist', 'Playlist management endpoints')
    .addServer('http://localhost:4000', 'Development server')
    .addServer('http://localhost:4000/api', 'API prefix server')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Music Playlist API Documentation',
  });
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Documentation available at: http://localhost:${port}/api-docs`);
}
bootstrap();
