import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';

// export class GoogleStrategy extends PassportStrategy(Strategy) {
// PassportStrategy 생성자에 두 번째 인자로 strategy이름을 안 넘기면
// NestJS/Passport는 클래스 이름(GoogleStrategy)을 소문자로 변환한 뒤 'strategy'를 제거하려고 시도
// NestJS가 전략 이름을 자동으로 추론하는 동작에 의해 'google'이됨
// class이름이 바뀌면 guard에서 설정한 이름과 일치하지 않기 때문에 문제가 생김...
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
// 위처럼 네임을 명시적으로 지정하면 클래스이름이 바뀌어도 문제가 생기지 않음
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.SERVER_PORT}/auth/google`,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;
    console.log('google access token:', accessToken);
    console.log('google refresh token:', refreshToken);

    const providerId = id;
    const primaryEmail = emails[0].value;

    console.log(providerId, primaryEmail, name.familyName, name.givenName);
    return profile;
  }
}
