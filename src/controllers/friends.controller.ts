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
  // getModelSchemaRef,
  // patch,
  // put,
  del,
  requestBody,
  // response,
} from '@loopback/rest';
import {Friend, FriendsRequest} from '../models';
import {FriendRepository,FriendsRequestRepository} from '../repositories';
import {HttpError} from '../utils/http-error';
import {authenticate} from '@loopback/authentication';
import { UserRepository } from '@loopback/authentication-jwt';

@authenticate('jwt')
export class FriendsController {
  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(FriendRepository)
    public friendRepository : FriendRepository,
    @repository(FriendsRequestRepository)
    public friendRequestRepository : FriendsRequestRepository
  ) {}

  @post('/friendRequest')
  async sendFriendRequest (
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              userId: {type: 'string'},
              requestUserId: {type: 'string'},
            },
            required: ['userId', 'requestUserId'],
          },
        },
      },
    })
    friendRequestBody: {userId: string, requestUserId: string}
  ): Promise<FriendsRequest> {
    const requestExisting = await this.friendRequestRepository.findOne({where: {userId: friendRequestBody.userId, requestUserId: friendRequestBody.requestUserId} })
    if(!requestExisting) {
      return this.friendRequestRepository.create(friendRequestBody);
    } else {
      throw new HttpError(400, 'Error!. Friend request already exists.')
    }
  }

  @del('/refuseRequest')
  async refuseFriendRequest (
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              userId: {type: 'string'},
              requestUserId: {type: 'string'},
            },
            required: ['userId', 'requestUserId'],
          },
        },
      },
    })
    friendRequestBody: {userId: string, requestUserId: string}
  ): Promise<void> {
    const requestEntry = await this.friendRequestRepository.findOne({where: {userId: friendRequestBody.requestUserId, requestUserId: friendRequestBody.userId}});
    if (requestEntry) {
      await this.friendRequestRepository.deleteById(requestEntry._id);
    }
  }

  @post('/acceptRequest')
  async acceptFriendRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              userId: {type: 'string'},
              requestUserId: {type: 'string'},
            },
            required: ['userId', 'requestUserId'],
          },
        },
      },
    })
    friendRequestBody: {userId: string, requestUserId: string}
  ): Promise<Friend> {
    const requestEntry = await this.friendRequestRepository.findOne({where: {userId: friendRequestBody.requestUserId, requestUserId: friendRequestBody.userId}});
    if (!requestEntry) {
      throw new HttpError(400, 'Error!. There aren`t any request for that user');
    } else {
      // First delete entry from Friend Request table
      await this.friendRequestRepository.deleteById(requestEntry._id);
      const friendshipBody = {
        userId: friendRequestBody.userId,
        friendId: friendRequestBody.requestUserId
      }
      return this.friendRepository.create(friendshipBody);
    }
  }

  @del('/deleteFriend')
  async deleteFriend(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              userId: {type: 'string'},
              friendId: {type: 'string'},
            },
            required: ['userId', 'friendId'],
          },
        },
      },
    })
    friendRequestBody: {userId: string, friendId: string}
  ): Promise<void> {
    const friendshipFounded = await this.friendRepository.findOne({where: {userId: friendRequestBody.userId, friendId: friendRequestBody.friendId}});
    const friendshipFoundedBackwards = await this.friendRepository.findOne({where: {userId: friendRequestBody.friendId, friendId: friendRequestBody.userId}});
    if(friendshipFounded) {
      await this.friendRepository.deleteById(friendshipFounded._id);
    } else if( friendshipFoundedBackwards) {
      await this.friendRepository.deleteById(friendshipFoundedBackwards._id);
    } else {
      throw new HttpError(400,'Error!. There aren`t any entry for that users');
    }
  }

  async deleteFriendRelationships(
    id: string
  ): Promise <void> {
    const userFriendship = await this.friendRepository.find({where: {userId: id}});
    const userFriendId = await this.friendRepository.find({where: {friendId: id}});
    if(userFriendId) {
      for(const userEntry of userFriendId) {
        await this.friendRepository.deleteById(userEntry._id);
      }
    }
    if(userFriendship) {
      for(const userEntry of userFriendship) {
        await this.friendRepository.deleteById(userEntry._id);
      }
    }
  }

  async deleteFriendRequestEntries(
    id: string
  ): Promise<void> {
    const userIdEntries = await this.friendRequestRepository.find({where: {userId: id}});
    const requestUserIdEntries = await this.friendRequestRepository.find({where: {requestUserId: id}});
    if(requestUserIdEntries) {
      for(const userEntry of requestUserIdEntries) {
        await this.friendRequestRepository.deleteById(userEntry._id);
      }
    }
    if(userIdEntries) {
      for(const userEntry of userIdEntries) {
        await this.friendRequestRepository.deleteById(userEntry._id);
      }
    }
  }

  @get('/friendRequest/{id}')
  async getFriendRequest(
    @param.path.string('id') id: string,
  ): Promise<FriendsRequest[]> {
    const requestsFounded = await this.friendRequestRepository.find({where: {requestUserId: id}});
    if (requestsFounded.length > 0) {
      return requestsFounded;
    }
    return [];
  }

  @get('/getFriends/{id}')
  async getFriends (
    @param.path.string('id') id: string,
  ): Promise<string[] | null> {
    const friends: string[] = [];
    const findFriendsByUserId = await this.friendRepository.find({where: {userId: id}})
    if (findFriendsByUserId) {
      for (const friendEntry of findFriendsByUserId) {
        friends.push(friendEntry.friendId)
      }
    }
    const findFriendsByFriendId = await this.friendRepository.find({where: {friendId:id}})
    if (findFriendsByFriendId) {
      for (const friendEntry of findFriendsByFriendId) {
        friends.push(friendEntry.userId)
      }
    }
    return friends;
  }
}
