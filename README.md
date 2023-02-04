智能点名系统服务端

# 身份认证架构 JWT

全局配置文件管理采用：@nestjs/config

## 限流

使用:@nestjs/throttler

### 全局定义

```ts
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      //每60秒
      ttl: 60,
      //限制接口访问10次
      limit: 10,
    }),
  ],
  //定义全局守卫，这样可以在其他模块中使用限流
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### 控制器

```ts
import { Throttle } from '@nestjs/throttler'

@Controller('code')
export class CodeController extends BaseController {

  @Post('send')
  //限制每120秒请求1次
  @Throttle(1, 120)
  async send(@Body() dto: CodeDto) {
  	...
  }
}
```
