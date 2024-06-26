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
import {Category} from '../models';
import {CategoryRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

//* This decorator protects the API and the endpoints of CategoryController
@authenticate('jwt')
export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository : CategoryRepository,
  ) {}

  @post('/categories')
  @response(200, {
    description: 'Category model instance',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['_id'],
          }),
        },
      },
    })
    category: Omit<Category, '_id'>,
  ): Promise<Category> {
    return this.categoryRepository.create(category);
  }

  // @get('/categories/count')
  // @response(200, {
  //   description: 'Category model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(Category) where?: Where<Category>,
  // ): Promise<Count> {
  //   return this.categoryRepository.count(where);
  // }

  // @get('/categories')
  // @response(200, {
  //   description: 'Array of Category model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Category, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Category) filter?: Filter<Category>,
  // ): Promise<Category[]> {
  //   return this.categoryRepository.find(filter);
  // }

  // @patch('/categories')
  // @response(200, {
  //   description: 'Category PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Category, {partial: true}),
  //       },
  //     },
  //   })
  //   category: Category,
  //   @param.where(Category) where?: Where<Category>,
  // ): Promise<Count> {
  //   return this.categoryRepository.updateAll(category, where);
  // }

  // @get('/categories/{id}')
  // @response(200, {
  //   description: 'Category model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(Category, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(Category, {exclude: 'where'}) filter?: FilterExcludingWhere<Category>
  // ): Promise<Category> {
  //   return this.categoryRepository.findById(id, filter);
  // }

  @get('/categories/bycollection/{id}')
  @response(200, {
    description: 'Get all categories of a determined collection',
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
  async getCollectionCategories(
    @param.path.string('id') id: string
  ): Promise<Category[] | null> {
    const collectionCategories = await this.categoryRepository.find({where: {collectionId: id}});
    if (collectionCategories.length === 0) {
      return null;
    } else {
      return collectionCategories;
    }
  }

  // @patch('/categories/{id}')
  // @response(204, {
  //   description: 'Category PATCH success',
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Category, {partial: true}),
  //       },
  //     },
  //   })
  //   category: Category,
  // ): Promise<void> {
  //   await this.categoryRepository.updateById(id, category);
  // }

  // @put('/categories/{id}')
  // @response(204, {
  //   description: 'Category PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() category: Category,
  // ): Promise<void> {
  //   await this.categoryRepository.replaceById(id, category);
  // }

  @del('/categories/{id}')
  @response(204, {
    description: 'Category DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.categoryRepository.deleteById(id);
  }
}
