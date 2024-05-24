import {
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {ProductLike} from '../models';
import {ProductLikeRepository, ProductRepository} from '../repositories';
// import { HttpError } from '../utils/http-error';
import {authenticate} from '@loopback/authentication';

//* This decorator protects the API and the endpoints of CategoryController
@authenticate('jwt')
export class ProductLikeController {
  constructor(
    @repository(ProductLikeRepository)
    public productLikeRepository : ProductLikeRepository,
    @repository(ProductRepository)
    public productRepository : ProductRepository,
  ) {}

  @post('/productLike')
  @response(200, {
    description: 'ProductLike model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductLike)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductLike, {
            title: 'NewProductLike',
            exclude: ['_id'],
          }),
        },
      },
    })
    productLike: Omit<ProductLike, '_id'>,
  ): Promise<void> {
    const product = await this.productRepository.findById(productLike.productId);
    product.likes = product.likes ? product.likes + 1: 1;
    await this.productRepository.updateById(productLike.productId, product);
    await this.productLikeRepository.create(productLike);
  }

  @del('/productLike')
  async unLike(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductLike, {
            title: 'NewProductLike',
            exclude: ['_id'],
          }),
        },
      },
    })
    productLike: Omit<ProductLike, '_id'>,
  ): Promise<void> {
    const product = await this.productRepository.findById(productLike.productId);
    if(product.likes)
      product.likes = product.likes === 0 ? 0 : product.likes -= 1;
    await this.productRepository.updateById(productLike.productId, product);
    const foundedProductLike = await this.productLikeRepository.findOne({where: {userId: productLike.userId, productId: productLike.productId}})
    if(foundedProductLike)
      await this.productLikeRepository.deleteById(foundedProductLike._id);
  }

  @get('/productLike/{userId}/{productId}')
  @response(200, {
    description: 'ProductLike model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductLike, {includeRelations: true}),
      },
    },
  })
  async checkIfUserLikedProduct(
    @param.path.string('userId') userId: string,
    @param.path.string('productId') productId: string,
  ): Promise<Boolean> {
    const productLikedByUser = await this.productLikeRepository.findOne({where: {userId: userId, productId:productId}})
    if(productLikedByUser) {
      return true;
    }
    return false;
  }

}
