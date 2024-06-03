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
  patch,
  // put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Product} from '../models';
import {ProductRepository, CollectionRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import { type HomeViewProductDataInterface } from '../interfaces/homeViewProductData.interface';

//* This decorator protects the API and the endpoints of CategoryController
@authenticate('jwt')
export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(CollectionRepository)
    public collectionRepository: CollectionRepository,
  ) {}

  @post('/products')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
            exclude: ['_id'],
          }),
        },
      },
    })
    product: Omit<Product, '_id'>,
  ): Promise<Product> {
    return this.productRepository.create(product);
  }

  @get('/products/byCollectionId/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            collectionId: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async getCollectionProducts(
    @param.path.string('id') id: string,
  ): Promise<Product[] | null> {
    const collectionProducts = await this.productRepository.find({
      where: {collectionId: id},
    });
    if (collectionProducts.length === 0) {
      return null;
    }
    return collectionProducts;
  }

  // @get('/products/count')
  // @response(200, {
  //   description: 'Product model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(Product) where?: Where<Product>,
  // ): Promise<Count> {
  //   return this.productRepository.count(where);
  // }

  @get('/products')
  async find(): Promise<HomeViewProductDataInterface[]> {
    const productData: HomeViewProductDataInterface[] = [];
    const filter = {
      limit: 20,
      order: ['createdAt DESC'],
    };
    const products = await this.productRepository.find(filter);
    if(products) {
      for (const product of products) {
        const collection = await this.collectionRepository.findOne({where :{_id: product.collectionId as string}});
        if (collection){
          const newProductData:HomeViewProductDataInterface = {
            _id: product._id as string,
            name: product.name,
            description: product.description,
            image: product.image,
            publicationDate: product.publicationDate,
            ownerId: collection.ownerId as string,
            likes: product.likes
          }
          productData.push(newProductData);
        }
      }
    }
    return productData;
  }

  // @patch('/products')
  // @response(200, {
  //   description: 'Product PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Product, {partial: true}),
  //       },
  //     },
  //   })
  //   product: Product,
  //   @param.where(Product) where?: Where<Product>,
  // ): Promise<Count> {
  //   return this.productRepository.updateAll(product, where);
  // }

  @get('/product/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<Product> {
    return this.productRepository.findById(id);
  }

  @patch('/products/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Product,
  ): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  // @put('/products/{id}')
  // @response(204, {
  //   description: 'Product PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() product: Product,
  // ): Promise<void> {
  //   await this.productRepository.replaceById(id, product);
  // }

  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
