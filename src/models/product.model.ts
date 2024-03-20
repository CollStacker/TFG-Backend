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
  })
  description: string;

  @property({
    type: 'string',
    default: null,
  })
  image?: string;

  @property({
    type: 'string',
  })
  releaseYear?: string;

  @property({
    type: 'string',
  })
  brand?: string;

  @property({
    type: 'string',
    required: true,
  })
  collectionId: String;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {

}

export type ProductWithRelations = Product & ProductRelations;
