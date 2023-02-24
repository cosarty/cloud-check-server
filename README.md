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

## 权限设计

- student
  - 签到
  - 查看自己的信息
  - 查看签到
  - 查看签到信息
- teacher
  - 发布签到
  - 创建课程
  - 查看课程
- super
  - 全部权限
- admin
  - 采集信息图片

## 笔记

### class-transformer 和 class-validator

嵌套校验

我们需要利用两个装饰器

- `@Type` 这个装饰器主要帮助我们进行递归 JSON 的实例化，如果不进行实例化的话无法使用下面那个装饰器进行递归校验
- `@ValidateNested` 开启递归校验

需要实现一下 validatePipe 使用 plainToClass 进行装换

```ts
const deepError = (errors: ValidationError): ValidateErrInfo[] => {
  const field = errors.property;
  const message = errors.constraints
    ? Object.values(errors.constraints)[0]
    : '';
  if (errors.children?.length > 0) {
    const errList: ValidateErrInfo[] = [];
    for (const error of errors.children) {
      error.property = `${field}.${error.property}`;
      let err: any = deepError(error);
      err = Array.isArray(err) ? err.flat(Infinity) : [err];
      errList.push(...err);
    }
    return errList;
  }
  return [{ field, message }];
};

export class ValidatePipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    //前台提交的表单数据没有类型，使用 plainToClass 转为有类型的对象用于验证
    const object = plainToClass(metatype, value);

    //根据 DTO 中的装饰器进行验证
    const errors = await validate(object);

    if (errors.length) {
      const messages = errors.flatMap((error) => {
        return deepError(error);
      });

      throw new MyException({ error: messages, code: '400' });
    }
    return value;
  }
}

// main.ts
app.useGlobalPipes(new ValidatePipe({ whitelist: false }));
```

### nextjs 读取 form-data 类型的请求体

**NestJS 提供了内置的 multipart/form-data parser，您可以使用 FileInterceptor 对其进行访问**

```ts
 @UseInterceptors(FileInterceptor('classId'))
```

一定要注意裝飾器的顺序