import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(8001)
export class AppGateway {
  @SubscribeMessage('message')
  sendMessage() {
    console.log('salut les boys');
  }
}
