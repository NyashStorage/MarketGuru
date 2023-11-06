import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenMiddleware } from './middlewares/refresh-token.middleware';
import { DisableCacheMiddleware } from './middlewares/disable-cache.middleware';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TokensModule,
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('*');
    consumer.apply(DisableCacheMiddleware).forRoutes('*');
  }
}
