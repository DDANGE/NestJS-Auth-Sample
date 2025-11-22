import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
// 1 PassportSerializer 상속받음
export class SessionSerializer extends PassportSerializer {
  // 2 UserService 의존성 주입(getUser(email))
  constructor(private userService: UserService) {
    super();
  }

  // 3 세션에 정보를 저장할 때 사용
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user.email);
  }

  // 4 세션에서 정보를 꺼내올 때 사용
  async deserializeUser(
    payload: any,
    done: (err: Error, payload: any) => void,
  ): Promise<any> {
    const user = await this.userService.getUser(payload);
    // 5 유저 정보가 없는 경우 done()함수에 에러전달
    if (!user) {
      done(new Error('No User'), null);
      return;
    }
    const { password: _password, ...userInfo } = user;
    // 6 유저 정보가 있다면 유저 정보 반환
    done(null, userInfo);
  }
}

// 1
// PassportSerializer는 serializeUser(), deserializeUser(), getPassportInstance()를 제공
// serializeUser : 세션에 정보를 저장
// deserializeUser : 세션에서 가져온 정보로 유저 정보를 반환
// getPassportInstance : 패스포트 인스턴스를 가져옴. 패스포트 인스턴스의 데이터가 필요한 경우

// 2
// 세션에는 유저의 email만 저장함... email로 user정보를 가져오기 위해 userService 의존성 주입

// 3
// serializeUser는 세션에 정보를 저장할때 사용
// user정보는 LocalAuthGuard의 canActivate() 매서드에 super.login(request)를 호출 할때
// 내부적으로 request에 있는 user 정보를 꺼내서 전달 하면서 serializeUser()를 실행

// 4
// deserializeUser는 인증이 되었는지 세션에 있는 정보를 가지고 검증할 때 사용
// payload는 세션에서 꺼내온 값 (request.session으로 확인가능)
// 세션에는 email만 저장... userService.getUser(payload)로 유저가 있는지 확인가능
