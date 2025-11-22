import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
//npm i @nestjs/passport passport passport-local express-session
//npm i -D @types/passport-local @types/express-session
// * as => CommonJS 방식(module.exports = function ...)으로 작성된 오래된 모듈을 가져올 때 흔히 쓰는 패턴.
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 전역 파이프에 validationPipe 객체 추가
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_ENCRYPTION_KEY, // 세션 암호화에 사용되는 키 (ConfigModule을 사용했음)
      resave: false, // 세션을 항상 저장할지 여부
      saveUninitialized: false, // 세션이 저장되기 전에는 초기화 하지 않은 상태로 세션을 미리 만들어 저장
      cookie: { maxAge: 3600000 }, // 쿠키 유효시간 1시간
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
