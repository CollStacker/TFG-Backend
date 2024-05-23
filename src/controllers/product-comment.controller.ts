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
import {ProductComments} from '../models';
import {ProductCommentsRepository, ProductRepository} from '../repositories';

export class ProductCommentController {
  constructor(
    @repository(ProductCommentsRepository)
    public productCommentsRepository : ProductCommentsRepository,
    @repository(ProductRepository)
    public productRepository : ProductRepository,
  ) {}

  @post('/productComments')
  @response(200, {
    description: 'ProductComments model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductComments)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductComments, {
            title: 'NewProductComments',
            exclude: ['_id'],
          }),
        },
      },
    })
    productComments: Omit<ProductComments, '_id'>,
  ): Promise<ProductComments> {
    return this.productCommentsRepository.create(productComments);
  }

  @get('/productComments/byProductId/{productId}')
  @response(200, {
    description: 'ProductComments model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductComments, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('productId') productId: string,
  ): Promise<ProductComments[] | null> {
    return this.productCommentsRepository.find({where: {productId: productId}})
  }

  @del('/productComments/{id}')
  @response(204, {
    description: 'ProductComments DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productCommentsRepository.deleteById(id);
  }

  // @get('/productComments/count')
  // @response(200, {
  //   description: 'ProductComments model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(ProductComments) where?: Where<ProductComments>,
  // ): Promise<Count> {
  //   return this.productCommentsRepository.count(where);
  // }

  // @get('/productComments')
  // @response(200, {
  //   description: 'Array of ProductComments model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(ProductComments, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(ProductComments) filter?: Filter<ProductComments>,
  // ): Promise<ProductComments[]> {
  //   return this.productCommentsRepository.find(filter);
  // }

  // @patch('/productComments')
  // @response(200, {
  //   description: 'ProductComments PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(ProductComments, {partial: true}),
  //       },
  //     },
  //   })
  //   productComments: ProductComments,
  //   @param.where(ProductComments) where?: Where<ProductComments>,
  // ): Promise<Count> {
  //   return this.productCommentsRepository.updateAll(productComments, where);
  // }

  // @get('/productComments/{id}')
  // @response(200, {
  //   description: 'ProductComments model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(ProductComments, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(ProductComments, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductComments>
  // ): Promise<ProductComments> {
  //   return this.productCommentsRepository.findById(id, filter);
  // }

  // @patch('/productComments/{id}')
  // @response(204, {
  //   description: 'ProductComments PATCH success',
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(ProductComments, {partial: true}),
  //       },
  //     },
  //   })
  //   productComments: ProductComments,
  // ): Promise<void> {
  //   await this.productCommentsRepository.updateById(id, productComments);
  // }

  // @put('/productComments/{id}')
  // @response(204, {
  //   description: 'ProductComments PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() productComments: ProductComments,
  // ): Promise<void> {
  //   await this.productCommentsRepository.replaceById(id, productComments);
  // }
}
