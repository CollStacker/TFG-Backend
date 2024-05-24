import {
  repository,
} from '@loopback/repository';
import {
  post,
  get,
  getModelSchemaRef,
  del,
  requestBody,
  response,
  param
} from '@loopback/rest';
import {Message, MessageRelations} from '../models';
import {MessageRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class MessageController {
  constructor(
    @repository(MessageRepository)
    public messageRepository : MessageRepository,
  ) {}

  @post('/messages')
  @response(200, {
    description: 'Message model instance',
    content: {'application/json': {schema: getModelSchemaRef(Message)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Message, {
            title: 'NewMessage',
            exclude: ['_id'],
          }),
        },
      },
    })
    message: Omit<Message, '_id'>,
  ): Promise<Message> {
    return this.messageRepository.create(message);
  }

  @get('/messages/{senderId}/{receiverId}')
  @response(200, {
    description: 'Message model instance',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Message, {includeRelations: true}),
        },
      },
    },
  })
  async getConversation(
    @param.path.string('senderId') senderId: string,
    @param.path.string('receiverId') receiverId: string,
  ): Promise<Message[]> {
    const sendedMessages = await this.messageRepository.find({where: {senderId: senderId, receiverId: receiverId}});
    const receivedMessages = await this.messageRepository.find({where: {senderId: receiverId, receiverId: senderId}});
    return sendedMessages.concat(receivedMessages).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  @del('/messages/')
  @response(204, {
    description: 'Message DELETE success',
  })
  async deleteConversation(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              senderId: {type: 'string'},
              receiverId: {type: 'string'},
            },
            required: ['currentUserId', 'newFriendId'],
          },
        },
      },
    }) usersId : {senderId: string, receiverId:string}
  ): Promise<void> {
    const sendedMessages = await this.messageRepository.find({where: {senderId: usersId.senderId, receiverId: usersId.receiverId}})
    const receivedMessages = await this.messageRepository.find({where: {senderId: usersId.receiverId, receiverId: usersId.senderId}})
    await this.deleteMessages(sendedMessages,receivedMessages);
  }

  async deleteMessages(sendedMessages: (Message & MessageRelations)[], receivedMessages: (Message & MessageRelations)[]): Promise<void> {
    for (const message of sendedMessages) {
      await this.messageRepository.delete(message);
    }
    for (const message of receivedMessages) {
      await this.messageRepository.delete(message);
    }
  }
}
