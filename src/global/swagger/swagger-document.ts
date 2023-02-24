import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('최종프로젝트')
  .setDescription('내배캠 노드 최종프로젝트')
  .setVersion('0.1')
  .addBearerAuth(
    // TODO: 토큰 인증 스웨거 문서에서 되는지 확인 필요
    {
      type: 'http',
      scheme: 'bearer',
      name: 'Authorization',
      in: 'header',
    },
    'accessToken',
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
