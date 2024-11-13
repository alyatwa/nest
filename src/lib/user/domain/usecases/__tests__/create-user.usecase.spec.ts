import { CreateUserUseCase } from '../create-user.usecase';
import { GetUserUseCase } from '../get-user.usecase';
import { ConfigService } from '@nestjs/config';
import { GeolocationService } from '../../../infrastructure/rest-api/geolocation.service';
import { CheckUserLocationUseCase } from '../check-user-location.usecase';
import { UserEntity } from '../../../infrastructure/data/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockUserRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CreateUser', () => {
  let userRepository: MockRepository<UserEntity>;
  let getUserUseCase: GetUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  let userRepositoryToken: string | Function = getRepositoryToken(UserEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: userRepositoryToken,
          useValue: mockUserRepository(),
        },
        CreateUserUseCase,
        GetUserUseCase,
        GeolocationService,
        CheckUserLocationUseCase,
      ],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    getUserUseCase = module.get<GetUserUseCase>(GetUserUseCase);
    userRepository = module.get<MockRepository<UserEntity>>(getRepositoryToken(UserEntity));
  });
  it('should return user', async () => {
    const mockedUser = {
      latitude:30.0,
      longitude:31.0,
      name: 'ahmed',
      email: 'user@email.com',

    };

    userRepository.findOne.mockResolvedValue(null);
    userRepository.save.mockResolvedValue(mockedUser);
    const result = await createUserUseCase.execute(mockedUser);

    expect(result).toEqual(mockedUser);
  });

});
