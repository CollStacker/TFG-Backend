import {Entity, model, property} from '@loopback/repository';

@model()
export class Message extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @property({
    type: 'date',
    required: true,
  })
  date: Date | string;

  @property({
    type: 'string',
    required: true,
  })
  senderUser: string;

  @property({
    type: 'string',
    required: true,
  })
  receiverUser: string;


  constructor(data?: Partial<Message>) {
    super(data);
  }
}

export interface MessageRelations {
  // describe navigational properties here
}

export type MessageWithRelations = Message & MessageRelations;
