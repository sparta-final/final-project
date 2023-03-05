import { swaggerDocumentBuilder } from './global/swagger/swagger-document';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './global/exception/http-exception';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { MyLogger } from './global/logger/my-logger';
import * as cookieParser from 'cookie-parser';
import { UndefinedToNullInterceptor } from './global/common/interceptor/undifinedToNull.interceptor';

// HOT RELOAD
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // LOGGER
    logger: new MyLogger(),
  });

  const port = process.env.PORT;

  // HOT RELOAD
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  // COOKIE-PARSER
  app.use(cookieParser());
  // VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      // JSON 페이로드를 DTO 프로퍼티에 지정된 타입으로 변환
      transform: true,
      // validation 데코레이터(ex.@IsString())가 없는 모든 프로퍼티 제거
      whitelist: false,
      // 알수없는 프로퍼티가 유효성 검사를 통과하는거 방지
      forbidUnknownValues: false,
    })
  );
  // INTERCEPTOR (undefined -> null)
  app.useGlobalInterceptors(new UndefinedToNullInterceptor());
  // EXCEPTION FILTER (HTTP)
  app.useGlobalFilters(new HttpExceptionFilter());
  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  // TODO: 나중에 multer 쓰면 저장할 폴더 / S3같은거 이용하면 필요없을듯?
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  // SWAGGER DOCUMENT
  swaggerDocumentBuilder(app);

  await app.listen(3000);
  Logger.log(`Listening on port ${port} !!`);
}
bootstrap();
