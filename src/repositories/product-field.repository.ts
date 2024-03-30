import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {ProductField, ProductFieldRelations} from '../models';

export class ProductFieldRepository extends DefaultCrudRepository<
  ProductField,
  typeof ProductField.prototype._id,
  ProductFieldRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(ProductField, dataSource);
  }
}
