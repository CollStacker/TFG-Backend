import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Collection, CollectionRelations} from '../models';

export class CollectionRepository extends DefaultCrudRepository<
  Collection,
  typeof Collection.prototype._id,
  CollectionRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Collection, dataSource);
  }
}
