import {ProductRepository, CategoryRepository, CollectionRepository, FriendRepository, UserRepository} from '../../repositories';
import { endpointTestdb } from '../fixtures/datasources/endpointTestdb.datasource';
import { Collection, Category, Product } from '../../models';

export async function givenEmptyEndpointDatabase() {
  await new ProductRepository(endpointTestdb).deleteAll();
  await new CategoryRepository(endpointTestdb).deleteAll();
  await new CollectionRepository(endpointTestdb).deleteAll();
  await new FriendRepository(endpointTestdb).deleteAll();
  await new UserRepository(endpointTestdb).deleteAll();
}

//* 3. Collection
export function givenCollectionData(data?: Partial<Collection>) {
  return Object.assign(
    {
      // _id: '00003',
      title: 'testCollection',
      ownerId: '00001'
    },
    data,
  );
}

export async function givenCollection(data?: Partial<Collection>) {
  return new CollectionRepository(endpointTestdb).create(givenCollectionData(data));
}

//* 4. Category
export function givenCategoryData(data?: Partial<Category>) {
  return Object.assign(
    {
      // _id: '00004',
      name: 'testCategory',
      collectionId: '00003'
    },
    data,
  );
}

export async function givenCategory(data?: Partial<Category>) {
  return new CategoryRepository(endpointTestdb).create(givenCategoryData(data));
}

//* 5. Product
export function givenProductData(data?: Partial<Product>) {
  return Object.assign(
    {
      // _id: '00005',
      name: 'testProduct',
      collectionId: '00003'
    },
    data,
  );
}

export async function givenProduct(data?: Partial<Product>) {
  return new ProductRepository(endpointTestdb).create(givenProductData(data));
}
