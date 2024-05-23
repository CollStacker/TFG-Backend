import {Entity, model, property} from '@loopback/repository';

@model()
export class ProductComments extends Entity {
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
  publicationDate: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string; //* User who create the comment

  @property({
    type: 'string',
    required: true,
  })
  productId: string;


  constructor(data?: Partial<ProductComments>) {
    super(data);
  }
}

export interface ProductCommentsRelations {
  // describe navigational properties here
}

export type ProductCommentsWithRelations = ProductComments & ProductCommentsRelations;
