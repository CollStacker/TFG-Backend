import {Entity, model, property} from '@loopback/repository';

@model()
export class Product extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    default: null,
  })
  image?: string;

  //! NEED TO KNOW HOW TO RELATE TO COLLECTION MODEL
  // @property({
  //   type: 'string',
  // })
  // collection?: string;

  @property({
    type: 'string',
  })
  releaseYear?: string;

  @property({
    type: 'string',
  })
  brand?: string;


  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
