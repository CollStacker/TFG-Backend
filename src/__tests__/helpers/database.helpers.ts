import {ProductRepository, CategoryRepository, CollectionRepository, FriendRepository, ProductFieldRepository, MessageRepository, FriendsRequestRepository} from '../../repositories';
import {Product, Category, Collection, Friend, ProductField, Message, FriendsRequest} from '../../models'
import {testdb} from '../fixtures/datasources/testdb.datasource';

export async function givenEmptyDatabase() {
  await new ProductRepository(testdb).deleteAll();
  await new CategoryRepository(testdb).deleteAll();
  await new CollectionRepository(testdb).deleteAll();
  await new FriendRepository(testdb).deleteAll();
  // await new UserRepository(testdb).deleteAll();
  await new ProductFieldRepository(testdb).deleteAll();
}

//* GIVING DATA TO THE TEST DATABASE
//* 1. User
// export function givenUserData(data?: Partial<UserModel>) {
//   return Object.assign(
//     {
//       // _id: '00001',
//       username: 'AdrianTest01',
//       name: 'Adrian',
//       surnames: 'Glez Exp',
//       email: 'adriantest@gmail.com',
//       password: '12345678aA@',
//     },
//     data,
//   );
// }

// export async function givenUser(data?: Partial<UserModel>) {
//   return new UserRepository(testdb).create(givenUserData(data));
// }

//* 2. Friend && FriendRequest
export function givenFriendData(data?: Partial<Friend>) {
  return Object.assign(
    {
      // _id: '00002',
      userId: '00001',
      friendId: '00002'
    },
    data,
  );
}

export async function givenFriend(data?: Partial<Friend>) {
  return new FriendRepository(testdb).create(givenFriendData(data));
}

export function givenFriendRequestData(data?: Partial<FriendsRequest>) {
  return Object.assign(
    {
      // _id: '00002',
      userId: '00001',
      requestUserId: '00002'
    },
    data,
  );
}

export async function givenFriendRequest(data?: Partial<FriendsRequest>) {
  return new FriendsRequestRepository(testdb).create(givenFriendData(data));
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
  return new CollectionRepository(testdb).create(givenCollectionData(data));
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
  return new CategoryRepository(testdb).create(givenCategoryData(data));
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
  return new ProductRepository(testdb).create(givenProductData(data));
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
  return new ProductFieldRepository(testdb).create(givenProductFieldData(data));
}

//* 7.Message
export function givenMessageData(data?: Partial<Message>) {
  return Object.assign(
    {
      content: 'testMessage',
      senderId: '00001',
      receiverId: '00002',
    },
    data,
  );
}

export async function givenMessageField(data?: Partial<Message>) {
  return new MessageRepository(testdb).create(givenMessageData(data));
}

