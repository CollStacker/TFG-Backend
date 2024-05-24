import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {ProductLike, ProductLikeRelations} from '../models';

export class ProductLikeRepository extends DefaultCrudRepository<
  ProductLike,
  typeof ProductLike.prototype._id,
  ProductLikeRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(ProductLike, dataSource);
  }
}
