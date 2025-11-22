import {
  Controller,
  Body,
  Post,
  Get,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';
import { LoginGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    return await this.authService.register(userDto);
  }

  @Post('login')
  async login(@Request() req, @Response() res) {
    const userInfo = await this.authService.validateUser(
      req.body.email,
      req.body.password,
    );

    if (userInfo) {
      res.cookie('login', JSON.stringify(userInfo), {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.json({ message: '로그인 성공' });
    }
    return res.json({ message: '로그인 실패' });
  }

  @UseGuards(LoginGuard)
  @Post('login2')
  async login2(@Request() req, @Response() res) {
    if (!req.cookies['login'] && req.user) {
      res.cookie('login', JSON.stringify(req.user), {
        httpOnly: true,
        maxAge: 1000 * 10,
      });
    }
    console.log(req.user);
    console.log(res.cookie['login']);
    return res.send({ message: 'login2 success' });
  }

  @UseGuards(LoginGuard)
  @Get('test-guard')
  testGuard() {
    return '로그인이 된때에만 글이 보입니다.';
  }
}
