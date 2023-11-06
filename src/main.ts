import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';

(async () => {
  try {
    // Preparing modules and services.
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Configuring base.
    app.enableCors({
      origin: configService.get('frontend_url') || '*',
      credentials: true,
      exposedHeaders: 'X-Access-Token',
    });

    // Registering Nest global objects.
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: (errors: ValidationError[]) => {
          const validationError = errors[0];
          const constraints = validationError.constraints;
          const error = Object.values(constraints)[0];

          return new BadRequestException(error);
        },
      }),
    );

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        strategy: 'excludeAll',
      }),
    );

    // Initializing documentation.
    SwaggerModule.setup(
      'api/docs',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('MarketGuru documentation')
          .setVersion('1.0.0')
          .addBearerAuth()
          .build(),
      ),
    );

    // Starting.
    await app.listen(configService.get('api_port') || 5200);
  } catch (e: any) {
    Logger.error(
      `Something went wrong when starting application: ${e.message}`,
    );
  }
})();
