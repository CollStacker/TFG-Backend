import {Entity, model, property} from '@loopback/repository';

@model()
export class Friend extends Entity {
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
  userId: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  friends?: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: false
  })
  friendRequestList?: string[];

  constructor(data?: Partial<Friend>) {
    super(data);
  }
}

export interface FriendRelations {
  // describe navigational properties here
}

export type FriendWithRelations = Friend & FriendRelations;
