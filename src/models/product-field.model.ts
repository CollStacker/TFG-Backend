import {Entity, model, property} from '@loopback/repository';

@model()
export class ProductField extends Entity {
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
  key: string;

  @property({
    type: 'any',
    required: true,
  })
  value: unknown;

  @property({
    type: 'string',
  })
  type?: string;


  constructor(data?: Partial<ProductField>) {
    super(data);
  }
}

export interface ProductFieldRelations {
  // describe navigational properties here
}

export type ProductFieldWithRelations = ProductField & ProductFieldRelations;
