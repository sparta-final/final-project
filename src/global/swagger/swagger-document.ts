import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('최종프로젝트')
  .setDescription('내배캠 노드 최종프로젝트')
  .setVersion('0.1')
  .addServer('http://localhost:3000')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      name: 'Authorization',
      in: 'header',
      bearerFormat: 'JWT',
    },
    'access-token'
  )
  .build();

export const swaggerDocumentBuilder = (app: INestApplication): void => {
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
