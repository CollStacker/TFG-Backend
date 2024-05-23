import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {ProductComments, ProductCommentsRelations} from '../models';

export class ProductCommentsRepository extends DefaultCrudRepository<
  ProductComments,
  typeof ProductComments.prototype._id,
  ProductCommentsRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(ProductComments, dataSource);
  }
}
