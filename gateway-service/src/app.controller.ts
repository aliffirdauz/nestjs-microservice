import { Controller, Get, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly http: HttpService) {}

  @Post('users')
  async createUser(@Body() body: any) {
    const res = await firstValueFrom(
      this.http.post('http://user-service:3000/users', body),
    );
    return res.data;
  }

  @Get('orders')
  async getOrders() {
    const res = await firstValueFrom(
      this.http.get('http://order-service:3001/orders'),
    );
    return res.data;
  }
}
