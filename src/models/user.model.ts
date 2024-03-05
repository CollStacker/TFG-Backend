import {Entity, model, property} from '@loopback/repository';

@model()
export class UserModel extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    },
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  surname: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  profilePhoto: string;

  @property({
    type: 'string',
    required: true,
  })
  biography: string;

  constructor(data?: Partial<UserModel>) {
    super(data);
  }
}

export interface UserRelations {
}

export type UserWithRelations = UserModel & UserRelations;
