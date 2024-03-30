import {
  // Count,
  // CountSchema,
  // Filter,
  // FilterExcludingWhere,
  repository,
  // Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  // patch,
  // put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {ProductField} from '../models';
import {ProductFieldRepository} from '../repositories';

export class ProductFieldController {
  constructor(
    @repository(ProductFieldRepository)
    public productFieldRepository : ProductFieldRepository,
  ) {}

  @post('/product-fields')
  @response(200, {
    description: 'ProductField model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductField)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductField, {
            title: 'NewProductField',
            exclude: ['_id'],
          }),
        },
      },
    })
    productField: Omit<ProductField, '_id'>,
  ): Promise<ProductField> {
    return this.productFieldRepository.create(productField);
  }

  // @get('/product-fields/count')
  // @response(200, {
  //   description: 'ProductField model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(ProductField) where?: Where<ProductField>,
  // ): Promise<Count> {
  //   return this.productFieldRepository.count(where);
  // }

  // @get('/product-fields')
  // @response(200, {
  //   description: 'Array of ProductField model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(ProductField, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(ProductField) filter?: Filter<ProductField>,
  // ): Promise<ProductField[]> {
  //   return this.productFieldRepository.find(filter);
  // }

  // @patch('/product-fields')
  // @response(200, {
  //   description: 'ProductField PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(ProductField, {partial: true}),
  //       },
  //     },
  //   })
  //   productField: ProductField,
  //   @param.where(ProductField) where?: Where<ProductField>,
  // ): Promise<Count> {
  //   return this.productFieldRepository.updateAll(productField, where);
  // }

  //* Endpoint to find every customField of a determinated product
  @get('/product-fields/{id}')
  @response(200, {
    description: 'ProductField model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductField, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<ProductField[] | null> {
    const foundedCustomFields = await this.productFieldRepository.find({where: { productId: id}});
    if (foundedCustomFields.length !== 0)
      return foundedCustomFields

    return null;
  }

  // @patch('/product-fields/{id}')
  // @response(204, {
  //   description: 'ProductField PATCH success',
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(ProductField, {partial: true}),
  //       },
  //     },
  //   })
  //   productField: ProductField,
  // ): Promise<void> {
  //   await this.productFieldRepository.updateById(id, productField);
  // }

  // @put('/product-fields/{id}')
  // @response(204, {
  //   description: 'ProductField PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() productField: ProductField,
  // ): Promise<void> {
  //   await this.productFieldRepository.replaceById(id, productField);
  // }

  @del('/product-fields/{id}')
  @response(204, {
    description: 'ProductField DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productFieldRepository.deleteById(id);
  }
}
