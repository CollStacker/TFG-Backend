// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import { MessageRepository } from '../repositories';
import { Socket, socketio } from '@loopback/socketio';
import { Message } from '../models';

@socketio('/')
export class WebsocketChatController {
  constructor(
    @repository(MessageRepository)
    private messageRepository: MessageRepository,
    @socketio.socket() // Equivalent to `@inject('ws.socket')`
    private socket: Socket,
  ) {}

  @socketio.connect()
  async connect(socket: Socket) {
  console.log('Client connected: ', socket.id);
  await socket.join('room 1');
  }

  @socketio.subscribe('chat')
  async chatHandler(
    @socketio.socket() socket: Socket,
    message: Message
  ) {
    const newMessage = new Message({
      content: message.content,
      date: message.date,
      senderId: message.senderId,
      receiverId: message.receiverId,
    });

    await this.messageRepository.create(newMessage);
    socket.emit('chat', newMessage);

    // const receiverSocket = socket.nsp.sockets.get(message.receiverId);
    // if (receiverSocket) {
    //   receiverSocket.emit('chat', newMessage);
    // }
  }
}
