import {Entity, hasMany, model, property} from '@loopback/repository';
import {Collection} from './collection.model'

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

  @property({
    type: 'array',
    itemType: 'string',
  })
  friends?: string[];

  @hasMany(() => Collection, {keyTo: 'userId'})
  collections?: Collection[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
}

export type UserWithRelations = User & UserRelations;
