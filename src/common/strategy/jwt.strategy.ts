import { MyException } from '@/util/MyException';
import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { IncomingMessage } from 'node:http';
import { User } from '@/models/users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {
    super({
      //解析用户提交的header中的Bearer Token数据
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //加密码的 secret
      secretOrKey: config.get('app.token_secret'),
    });
  }
  async validate(payload) {
    const isPass = await this.cache.get(
      `${payload.user.userId}_${payload.exp}`,
    );
    if (isPass) throw new UnauthorizedException();

    const user = await User.findOne({
      where: { userId: payload.user.userId, isBan: false },
    });
    if (!user) return false;
    payload.user = user.toJSON();
    return payload;
  }
}
