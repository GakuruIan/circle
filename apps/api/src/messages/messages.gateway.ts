/* eslint-disable prettier/prettier */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

// firebase
import * as admin from 'firebase-admin';

// message service
import { MessageService } from './messages.service';

// message dto
import { CreateMessageDTO } from './dto/message.dto';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: MessageService) {}
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      client.data.user = decoded;
      console.log('Socket user:', decoded.uid);
    } catch (err) {
      console.error('Invalid token:', err);
      client.disconnect();
    }

    client.broadcast.emit('online', {
      message: `User online: ${client.id}`,
      clientId: client.id,
    });
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Client disconnected', client.id);

    this.server.emit('offline', {
      message: `User left the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  @SubscribeMessage('message:new')
  handleNewMessage(@MessageBody() message: CreateMessageDTO): void {
    console.log('New message:', message);

    this.server.emit('reply', 'server reply');
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    @MessageBody() message: CreateMessageDTO,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { uid } = client.data.user;

      const result = await this.messageService.sendMessage(message, uid);
      result.recipientIds.forEach((userId) => {
        this.server.to(userId.toString()).emit('message:new', result);
      });
      client.emit('message:confirmed', result);
    } catch (err) {
      console.error(err);
      client.emit('message:error', { error: err.message });
    }
  }
}
