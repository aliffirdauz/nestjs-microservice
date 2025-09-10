import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(private readonly httpService: HttpService) {}

  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: string) {
    const res = await firstValueFrom(
      this.httpService.get(`http://order-service:3000/orders/user/${userId}`)
    );
    return res.data;
  }

  @Post()
  async createOrder(@Body() body: any) {
    const res = await firstValueFrom(
      this.httpService.post(`http://order-service:3000/orders`, body)
    );
    return res.data;
  }
}
