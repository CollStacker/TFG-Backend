import {Entity, model, property} from '@loopback/repository';

@model()
export class Collection extends Entity {
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
  title: string;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'string',
  })
  tag?: string;

  //* An front image about the collection items
  @property({
    type: 'string',
  })
  frontPage?: string;

  @property({
    type: 'string',
    required: true,
  })
  ownerId: String;

  constructor(data?: Partial<Collection>) {
    super(data);
  }
}

export interface CollectionRelations {
  // describe navigational properties here
}

export type CollectionWithRelations = Collection & CollectionRelations;
