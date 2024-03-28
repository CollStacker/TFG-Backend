import {Entity, model, property} from '@loopback/repository';

@model()
export class Category extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'string',
  })
  description: String;

  @property({
    type: 'string',
    required: true,
  })
  collectionId: string;

  @property({
    type: 'string',
  })
  parentId?: string;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
