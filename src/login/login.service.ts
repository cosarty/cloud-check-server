import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto } from './dto/create-login.dto';

@Injectable()
export class LoginService {
  constructor(private readonly jwtServe: JwtService) {}
  async create(createLoginDto: CreateLoginDto) {
    console.log('createLoginDto: ', createLoginDto);

    return {
      message: '获取成功',
      data: { token: await this.jwtServe.signAsync(createLoginDto) },
    };
  }
}
