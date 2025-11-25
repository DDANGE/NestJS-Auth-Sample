import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

//passport를 사용하지 않는 방식
@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.cookies['login']) {
      return true;
    }

    if (!request.body.email || !request.body.password) {
      return false;
    }

    const user = await this.authService.validateUser(
      request.body.email,
      request.body.password,
    );

    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }
}

// passport를 사용하려면 AuthGuard를 상속받아야함 -> canActivate 의무적으로 구현
@Injectable() // local 스트래티지사용 (passport-jwt, passport-google-oauth20 등...)
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}

// passport를 사용하려면 AuthGuard를 상속받아야함 -> canActivate 의무적으로 구현
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}

// passport를 사용하려면 AuthGuard를 상속받아야함 -> canActivate 의무적으로 구현
@Injectable()
//AuthGuard를 사용하는데 'google' strategy를 사용하겠다! -> google.strategy.ts가 있음
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    //const request = context.switchToHttp().getRequest();
    //console.log('google auth : ' + JSON.stringify(request));

    return result;
  }
}
