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

  private extraCount (count: number): number {
    return count + Math.floor(count / 11) * 10;
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
    const { id, count } = await this.tapsService.click(payload);
    client.emit('update', { id, count: this.extraCount(count) });
  }
}
