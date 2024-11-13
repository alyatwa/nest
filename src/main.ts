import { BadRequestException, Logger, NotFoundException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { existsSync } from 'node:fs';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerService } from './common/services/logger.service';
import { AllExceptionFilter } from './common/infrastructure/filter/exception.filter';

const logger = new Logger('Main');

async function bootstrap() {
  try {
    /* Check if .env file exists */
    if (!existsSync('./.env')) {
      throw new NotFoundException('.env file not found!');
    }

    /* Create server instance */
    const app = await NestFactory.create(AppModule);

    // Filter
    app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

    // interceptors
    app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
    app.useGlobalInterceptors(new ResponseInterceptor());

    /* Set CORS */
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      //allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN'],
    });

    /* Setup validation */
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true, // Automatically transform payloads to their expected types
        whitelist: true, // Strip out properties not defined in the DTO
        exceptionFactory(errors) {
          return new BadRequestException(
            errors.map((error) => ({
              property: error.property,
              message: error.constraints[Object.keys(error.constraints)[0]],
            })),
          );
        },
        stopAtFirstError: true,
      }),
    );

    /* Global prefix */
    app.setGlobalPrefix('/api/v1', {
      exclude: ['*'],
    });
    const configSwagger = new DocumentBuilder()
      .setTitle('Task API')
      .setDescription('The Task API')
      .setVersion('1.0')
      .addTag('Task')
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('api-docs', app, documentFactory);

    /* Get config */
    const config = app.get(ConfigService);

    await app.listen(config.get<number>('PORT'), '0.0.0.0', () => {
      logger.log(
        `Server is running on port ${config.get<number>('PORT')} in ${config.get<number>('NODE_ENV')} environment`,
        `🚀 Server working on http://localhost:${config.get<number>('PORT')}/api/v1/healthz`,
      );
    });

    /* Shutdown */
    const shutdown = async () => {
      await app.close();
      logger.log('😴 Server shutdown...');
      process.exit(0);
    };

    /* Graceful shutdown */
    process.on('SIGINT', () => {
      shutdown();
    });

    process.on('SIGTERM', () => {
      shutdown();
    });
  } catch (error) {
    console.error(`🚨 Error: ${error.message}`);
    process.exit(1);
  }
}
bootstrap();
