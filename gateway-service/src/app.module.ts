import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users.controller';
import { OrdersController } from './orders.controller';

@Module({
  imports: [HttpModule],
  controllers: [UsersController, OrdersController],
})
export class AppModule {}
