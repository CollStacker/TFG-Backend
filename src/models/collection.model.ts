import {Entity, belongsTo, hasMany, model, property} from '@loopback/repository';
import {Product} from './product.model'
import {User} from './user.model'
import {Category} from './category.model';

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
  tag: string;

  //* An front image about the collection items
  @property({
    type: 'string',
  })
  frontPage: string;

  @hasMany(() => Product)
  products?: Product[];

  @belongsTo(() => User, {keyFrom: 'userId', name: 'owner'})
  userId: string;

  @belongsTo(() => Category)
  categoryId: string;

  constructor(data?: Partial<Collection>) {
    super(data);
  }
}

export interface CollectionRelations {
  // describe navigational properties here
}

export type CollectionWithRelations = Collection & CollectionRelations;
