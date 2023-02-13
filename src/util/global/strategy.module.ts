import { databaseProviders } from '@/common/providers/database.providers';
import { JwtStrategy } from '@/common/strategy/jwt.strategy';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [JwtStrategy],
})
export class StrategyModule {}
