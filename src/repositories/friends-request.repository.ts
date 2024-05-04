import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {FriendsRequest, FriendsRequestRelations} from '../models';

export class FriendsRequestRepository extends DefaultCrudRepository<
  FriendsRequest,
  typeof FriendsRequest.prototype._id,
  FriendsRequestRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(FriendsRequest, dataSource);
  }
}
