import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';

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

  findAll() {
    return `This action returns all login`;
  }

  findOne(id: number) {
    return `This action returns a #${id} login`;
  }

  update(id: number, updateLoginDto: UpdateLoginDto) {
    return `This action updates a #${id} login`;
  }

  remove(id: number) {
    return `This action removes a #${id} login`;
  }
}
