import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { BadRequestException } from '@nestjs/common';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OrdersService', () => {
  let service: OrdersService;
  let repo: Repository<Order>;

  const mockOrder = {
    id: 'ord-123',
    product: 'Laptop',
    userId: 'aBc-D',
    price: 15000000,
  };

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // reset mock sebelum tiap test

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          // Mock Redis connection
          provide: 'default_IORedisModuleConnectionToken',
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            publish: jest.fn(),
            subscribe: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repo = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should create an order', async () => {
    const dto = { product: 'Laptop', userId: 'aBc-D', price: 15000000 };

    // Mock axios success
    mockedAxios.get.mockResolvedValueOnce({
      data: { id: dto.userId, name: 'Alif' },
    });

    // Mock repo
    (repo.create as jest.Mock).mockReturnValueOnce(mockOrder);
    (repo.save as jest.Mock).mockResolvedValueOnce(mockOrder);

    const result = await service.createOrder(dto.userId, dto.product, dto.price);

    expect(result).toEqual(mockOrder);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(mockOrder);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `http://user-service:3000/users/${dto.userId}`,
    );
  });

  it('should throw BadRequestException if user does not exist', async () => {
    const dto = { product: 'Laptop', userId: 'non-existent', price: 15000000 };

    // Mock axios error
    mockedAxios.get.mockRejectedValueOnce(new Error('User not found'));

    await expect(
      service.createOrder(dto.userId, dto.product, dto.price),
    ).rejects.toThrow(BadRequestException);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `http://user-service:3000/users/${dto.userId}`,
    );

    // Karena gagal, repo.create & save gak boleh dipanggil
    expect(repo.create).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  }); 
});
