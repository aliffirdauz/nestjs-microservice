import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRedis() private readonly redis: Redis,

    @Inject('USER_SERVICE') private readonly client: ClientProxy, // RabbitMQ Client
  ) {}

  async createUser(name: string, email: string) {
    const user = this.userRepo.create({ name, email });
    await this.userRepo.save(user);

    // Cache user
    await this.redis.set(`user:${user.id}`, JSON.stringify(user));

    // Emit event
    this.client.emit('user.created', {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return user;
  }

  async getUserById(id: string) {
    const cached = await this.redis.get(`user:${id}`);
    if (cached) return JSON.parse(cached);

    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    await this.redis.set(`user:${id}`, JSON.stringify(user));
    return user;
  }
}
