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
import { RoundsService } from '../rounds.service';
import { ForbiddenException } from '@nestjs/common';

const connections = new Map<string, Socket>();

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly tapsService: TapsService,
  ) { }
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
      console.log('connect', payload.username, client.id)
      connections.set(payload.username, client);

    } catch (err) {
      console.log(`Unauthorized socket connection:`, err.message);
      client.disconnect(); // Отклоняем соединение
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
  async handleClick(client: Socket, payload: { round_uuid: string, username: string }) {
    const { round_uuid, username } = payload;
    const {id, count} = await this.tapsService.click(username, round_uuid);
    connections.get(username)?.emit('update', {id, count})
  }
  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
