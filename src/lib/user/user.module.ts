import { TypeOrmModule } from '@nestjs/typeorm';
import { GetUserUseCase } from './domain/usecases/get-user.usecase';
import { UserEntity } from './infrastructure/data/entities/user.entity';
import { UserController } from './presentation/controllers/user.controller';
import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './domain/usecases/create-user.usecase';
import { GeolocationService } from './infrastructure/rest-api/geolocation.service';
import { CheckUserLocationUseCase } from './domain/usecases/check-user-location.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [GetUserUseCase, CreateUserUseCase, GeolocationService, CheckUserLocationUseCase],
  exports: [],
})
export class UserModule {}
