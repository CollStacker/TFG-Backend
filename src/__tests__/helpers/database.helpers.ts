import {ProductRepository, CategoryRepository, CollectionRepository, FriendRepository, UserRepository} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';

export async function givenEmptyDatabase() {
  await new ProductRepository(testdb).deleteAll();
  await new CategoryRepository(testdb).deleteAll();
  await new CollectionRepository(testdb).deleteAll();
  await new FriendRepository(testdb).deleteAll();
  await new UserRepository(testdb).deleteAll();
}
