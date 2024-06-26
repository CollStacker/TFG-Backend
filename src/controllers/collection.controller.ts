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
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Collection} from '../models';
import {CollectionRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
// import { HttpError } from '../utils/http-error';

//* This decorator protects the API and the endpoints of CategoryController
@authenticate('jwt')
export class CollectionController {
  constructor(
    @repository(CollectionRepository)
    public collectionRepository : CollectionRepository,
  ) {}

  @post('/collections')
  @response(200, {
    description: 'Collection model instance',
    content: {'application/json': {schema: getModelSchemaRef(Collection)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Collection, {
            title: 'NewCollection',
            exclude: ['_id'],
          }),
        },
      },
    })
    collection: Omit<Collection, '_id'>,
  ): Promise<Collection> {
    return this.collectionRepository.create(collection);
  }

  // @get('/collections/count')
  // @response(200, {
  //   description: 'Collection model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(Collection) where?: Where<Collection>,
  // ): Promise<Count> {
  //   return this.collectionRepository.count(where);
  // }

  // @get('/collections')
  // @response(200, {
  //   description: 'Array of Collection model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Collection, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Collection) filter?: Filter<Collection>,
  // ): Promise<Collection[]> {
  //   return this.collectionRepository.find(filter);
  // }

  // @patch('/collections')
  // @response(200, {
  //   description: 'Collection PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Collection, {partial: true}),
  //       },
  //     },
  //   })
  //   collection: Collection,
  //   @param.where(Collection) where?: Where<Collection>,
  // ): Promise<Count> {
  //   return this.collectionRepository.updateAll(collection, where);
  // }

  // @get('/collections/{id}')
  // @response(200, {
  //   description: 'Collection model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(Collection, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(Collection, {exclude: 'where'}) filter?: FilterExcludingWhere<Collection>
  // ): Promise<Collection> {
  //   return this.collectionRepository.findById(id, filter);
  // }

  @get('/collections/user/{id}')
  @response(200, {
    description: 'Get all collections of a determined user',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            ownerId: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async getUserCollections(
    @param.path.string('id') userId: string
  ): Promise<Collection[] | null> {
    const collections = await this.collectionRepository.find({where: {ownerId: userId}});
    if (collections.length === 0) {
      return null;
    }
    return collections;
  }

  @patch('/collections/{id}')
  @response(204, {
    description: 'Collection PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Collection, {partial: true}),
        },
      },
    })
    collection: Collection,
  ): Promise<void> {
    await this.collectionRepository.updateById(id, collection);
  }

  @put('/collections/{id}')
  @response(204, {
    description: 'Collection PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() collection: Collection,
  ): Promise<void> {
    await this.collectionRepository.replaceById(id, collection);
  }

  @del('/collections/{id}')
  @response(204, {
    description: 'Collection DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.collectionRepository.deleteById(id);
  }
}
