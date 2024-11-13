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

describe('GetUser', () => {
  const createArgs = {
    id: 1,
    email: 'user@email.com',
    latitude: 30.0,
    longitude: 31.0,
    name: 'John Doe',
  };
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
  it('should return user if user exists', async () => {
    const mockedUser = {
      id: '1',
      name: 'ahmed',
      email: 'user@email.com',
      city: 'cairo',
    };

    userRepository.findOne.mockResolvedValue(mockedUser);
    const result = await getUserUseCase.execute('1');

    expect(result).toEqual(mockedUser);
  });

  it('should throw error if user does not exist', async () => {
    try {
      userRepository.findOne.mockResolvedValue(null);

      const result = await getUserUseCase.execute('2');
    } catch (e) {
      // expect throw error if user not found
      expect(e.message).toBe('Failed to get user: User not found');
    }
  });
});
