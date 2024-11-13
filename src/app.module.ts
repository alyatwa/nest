import { DatabasePostgresModule } from './common/data/data-sources/typeorm/database-postgres.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UserModule, HealthModule } from './lib';
import { LoggerModule } from './common/infrastructure/logger/logger.module';
import { ExceptionsModule } from './common/infrastructure/exceptions/exceptions.module';
import { config } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    LoggerModule,
    UserModule,
    DatabasePostgresModule,
    HealthModule,
    ExceptionsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
