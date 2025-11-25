import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './local.strategy';
import { GoogleStrategy } from './google.strategy';

@Module({
  // 1 패스포트 모듈 추가
  imports: [UserModule, PassportModule.register({ session: true })],
  // 2 프로바이더 설정 추가
  providers: [AuthService, LocalStrategy, SessionSerializer, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

// 1
// PassportModule의 기본 session값은 false session을 사용할 수 있게 true로 설정

// 2
// LocalStrategy, SessionSerializer는 다른곳에서 사용할거기 때문에 providers에 등록
