import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {
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

  //! Here we have a "HasMany" relation with user data model.
  @property({
    type: 'array',
  })
  friends: Array<string>;

  //! Here we have a "HasMany" relation with collection data model.
  @property({
    type: 'array',
  })
  collection: Array<string>;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
