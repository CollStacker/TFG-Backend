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
    required: true,
  })
  description: string;

  //! NEED TO KNOW HOW TO CONNECT THAT PROPERTY TO ANOTHER DATA MODEL
  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // owner: string;

  @property({
    type: 'string',
    required: false,
  })
  tag: string;

  //! NEED TO KNOW HOW TO CONNECT THAT PROPERTY TO ANOTHER DATA MODEL
  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // category: string;

  //* An front image about the collection items
  @property({
    type: 'string',
    required: false,
  })
  frontPage: string;

  constructor(data?: Partial<Collection>) {
    super(data);
  }
}

export interface CollectionRelations {
  // describe navigational properties here
}

export type CollectionWithRelations = Collection & CollectionRelations;
