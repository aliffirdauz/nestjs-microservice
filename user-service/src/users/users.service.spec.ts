import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser = {
    id: 'aBc-D',
    name: 'Alif Firdaus',
    email: 'alif@example.com',
  };

  const mockUserRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          // Mock Redis
          provide: 'default_IORedisModuleConnectionToken',
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            publish: jest.fn(),
            subscribe: jest.fn(),
          },
        },
        {
          // Mock ClientProxy USER_SERVICE
          provide: 'USER_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const dto = { name: 'Alif Firdaus', email: 'alif@example.com' };
    const result = await service.createUser(dto.name, dto.email);

    expect(result).toEqual(mockUser);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(mockUser);
  });
});
