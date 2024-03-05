import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {UserModel, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
UserModel,
  typeof UserModel.prototype._id,
  UserRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(UserModel, dataSource);
  }
}
