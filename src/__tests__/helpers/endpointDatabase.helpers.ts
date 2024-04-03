import {ProductRepository, CategoryRepository, CollectionRepository, FriendRepository,MessageRepository, /*UserRepository,*/ ProductFieldRepository} from '../../repositories';
import { endpointTestdb } from '../fixtures/datasources/endpointTestdb.datasource';
import { Collection, Category, Product, Friend, ProductField, Message } from '../../models';

export async function givenEmptyEndpointDatabase() {
  await new ProductRepository(endpointTestdb).deleteAll();
  await new CategoryRepository(endpointTestdb).deleteAll();
  await new CollectionRepository(endpointTestdb).deleteAll();
  await new FriendRepository(endpointTestdb).deleteAll();
}

//* 2. Friend
export function givenFriendData(data?: Partial<Friend>) {
  return Object.assign(
    {
      // _id: '00002',
      userId: '00001'
    },
    data,
  );
}

export async function givenFriend(data?: Partial<Friend>) {
  return new FriendRepository(endpointTestdb).create(givenFriendData(data));
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

//* 6. Product-Field
export function givenProductFieldData(data?: Partial<ProductField>) {
  return Object.assign(
    {
      key: 'key',
      value: 'value',
      type: 'type',
      productId: '1',
    },
    data,
  );
}

export async function givenProductField(data?: Partial<ProductField>) {
  return new ProductFieldRepository(endpointTestdb).create(givenProductFieldData(data));
}

//* 7.Message
export function givenMessageData(data?: Partial<Message>) {
  return Object.assign(
    {
      content: 'testMessage',
      senderUser: '00001',
      receiverUser: '00002',
    },
    data,
  );
}

export async function givenMessageField(data?: Partial<Message>) {
  return new MessageRepository(endpointTestdb).create(givenMessageData(data));
}

