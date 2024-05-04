import {Entity, model, property} from '@loopback/repository';

@model()
export class FriendsRequest extends Entity {
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
    type: 'string',
    required: true,
  })
  requestUserId: string;


  constructor(data?: Partial<FriendsRequest>) {
    super(data);
  }
}

export interface FriendsRequestRelations {
  // describe navigational properties here
}

export type FriendsRequestWithRelations = FriendsRequest & FriendsRequestRelations;
