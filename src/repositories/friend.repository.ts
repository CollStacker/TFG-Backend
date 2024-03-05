import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Friend, FriendRelations} from '../models';

export class FriendRepository extends DefaultCrudRepository<
  Friend,
  typeof Friend.prototype._id,
  FriendRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Friend, dataSource);
  }
}
