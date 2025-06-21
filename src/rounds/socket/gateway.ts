import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { TapsService } from 'src/taps/taps.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly tapsService: TapsService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const payload = this.authService.getUserFromBearer(
        client.handshake.headers.authorization,
      );
      console.log('connect', payload.username, client.id);
    } catch (err) {
      console.log(`Unauthorized socket connection:`, err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, payload: any): string {
    return 'pong';
  }

  @SubscribeMessage('click')
  async handleClick(
    client: Socket,
    payload: { round_uuid: string; username: string },
  ) {
    let tap = await this.tapsService.click(payload, 1);
    if (tap.count === 11) {
      tap = await this.tapsService.click(payload, 10);
    }
    client.emit('update', { id: tap.id, count: tap.count });
  }
}
