import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserEventsController {
  @EventPattern('user.created')
  handleUserCreated(@Payload() data: any) {
    console.log('📩 Received user.created event:', data);
  }
}
