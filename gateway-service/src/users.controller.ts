import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(private readonly httpService: HttpService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.httpService.get(`http://user-service:3000/users/${id}`)
    );
    return res.data;
  }

  @Post()
  async createUser(@Body() body: any) {
    const res = await firstValueFrom(
      this.httpService.post(`http://user-service:3000/users`, body)
    );
    return res.data;
  }
}
