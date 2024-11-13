import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../infrastructure/data/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsersDto } from '../../presentation/dto/create-user.dto';
import { Repository } from 'typeorm';
import { GeolocationService } from '../../infrastructure/rest-api/geolocation.service';
import { CheckUserLocationUseCase } from './check-user-location.usecase';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private checkUserLocationUseCase: CheckUserLocationUseCase,
    private geolocationService: GeolocationService,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Executes the use case to create a new user.
   *
   * @param {CreateUsersDto} data - The data transfer object containing user information.
   * @returns {Promise<UserEntity>} A promise that resolves to the created user entity.
   */
  async execute(data: CreateUsersDto): Promise<UserEntity> {
    try {
      // check is email not registered
      const user = await this.userRepository.findOne({
        where: { email: data.email }, select:['id']
      });
      if (user) {
        throw new Error('Email already registered');
      }

      // check if user is within Egypt
      const inEgypt = await this.checkUserLocationUseCase.execute(data.latitude, data.longitude);
      if (!inEgypt) {
        throw new Error('User is not within Egypt');
      }

      // get city
      const city = await this.geolocationService.getCityFromCoordinates(data.latitude, data.longitude);

      // create user
      return await this.userRepository.save({ ...data, city });
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}
