import {Entity, model, property} from '@loopback/repository';

@model()
export class ProductLike extends Entity {
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
  productId: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;


  constructor(data?: Partial<ProductLike>) {
    super(data);
  }
}

export interface ProductLikeRelations {
  // describe navigational properties here
}

export type ProductLikeWithRelations = ProductLike & ProductLikeRelations;
