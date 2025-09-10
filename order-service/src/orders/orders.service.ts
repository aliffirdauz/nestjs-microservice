import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import axios from 'axios';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createOrder(userId: string, product: string, price: number) {
    // validasi user exist di user-service
    try {
      await axios.get(`http://user-service:3000/users/${userId}`);
    } catch {
      throw new BadRequestException('User does not exist');
    }

    const order = this.orderRepo.create({ userId, product, price });
    await this.orderRepo.save(order);

    await this.redis.set(`orders:${userId}`, JSON.stringify(order));
    return order;
  }

  async getOrdersByUserId(userId: string) {
    const cached = await this.redis.get(`orders:${userId}`);
    if (cached) return JSON.parse(cached);

    const orders = await this.orderRepo.findBy({ userId });
    await this.redis.set(`orders:${userId}`, JSON.stringify(orders));
    return orders;
  }
}
