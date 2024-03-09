import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
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
import {Friend} from '../models';
import {FriendRepository} from '../repositories';
import {HttpError} from '../utils/http-error';
//import {authenticate} from '@loopback/authentication';

export class FriendsController {
  constructor(
    @repository(FriendRepository)
    public friendRepository : FriendRepository,
  ) {}

  @post('/friends')
  @response(200, {
    description: 'Friend model instance',
    content: {'application/json': {schema: getModelSchemaRef(Friend)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Friend, {
            title: 'NewFriend',
            exclude: ['_id'],
          }),
        },
      },
    })
    friend: Omit<Friend, '_id'>,
  ): Promise<Friend> {
    return this.friendRepository.create(friend);
  }

  @get('/friends/count')
  @response(200, {
    description: 'Friend model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Friend) where?: Where<Friend>,
  ): Promise<Count> {
    return this.friendRepository.count(where);
  }

  @get('/friends')
  @response(200, {
    description: 'Array of Friend model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Friend, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Friend) filter?: Filter<Friend>,
  ): Promise<Friend[]> {
    return this.friendRepository.find(filter);
  }

  @patch('/friends')
  @response(200, {
    description: 'Friend PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Friend, {partial: true}),
        },
      },
    })
    friend: Friend,
    @param.where(Friend) where?: Where<Friend>,
  ): Promise<Count> {
    return this.friendRepository.updateAll(friend, where);
  }

  @get('/friends/{id}')
  @response(200, {
    description: 'Friend model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Friend, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Friend, {exclude: 'where'}) filter?: FilterExcludingWhere<Friend>
  ): Promise<Friend> {
    return this.friendRepository.findById(id, filter);
  }

  @patch('/friends/{id}')
  @response(204, {
    description: 'Friend PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Friend, {partial: true}),
        },
      },
    })
    friend: Friend,
  ): Promise<void> {
    await this.friendRepository.updateById(id, friend);
  }

  @put('/friends/{id}')
  @response(204, {
    description: 'Friend PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() friend: Friend,
  ): Promise<void> {
    await this.friendRepository.replaceById(id, friend);
  }

  @del('/friends/{id}')
  @response(204, {
    description: 'Friend DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.friendRepository.deleteById(id);
  }

  async deleteUserEntry(id:string): Promise<void> {
    const userEntry = await this.friendRepository.findOne({where: {userId: id}});
    if (userEntry){
      await this.friendRepository.deleteById(userEntry?._id);
    } else {
      throw new HttpError(400, 'There are not any entry in the db for that user.')
    }
  }
}
