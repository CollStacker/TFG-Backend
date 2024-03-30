import {
  // Count,
  // CountSchema,
  // Filter,
  FilterExcludingWhere,
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
import {Friend} from '../models';
import {FriendRepository} from '../repositories';
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

  // @get('/friends/count')
  // @response(200, {
  //   description: 'Friend model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(Friend) where?: Where<Friend>,
  // ): Promise<Count> {
  //   return this.friendRepository.count(where);
  // }

  // @get('/friends')
  // @response(200, {
  //   description: 'Array of Friend model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Friend, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Friend) filter?: Filter<Friend>,
  // ): Promise<Friend[]> {
  //   return this.friendRepository.find(filter);
  // }

  // @patch('/friends')
  // @response(200, {
  //   description: 'Friend PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Friend, {partial: true}),
  //       },
  //     },
  //   })
  //   friend: Friend,
  //   @param.where(Friend) where?: Where<Friend>,
  // ): Promise<Count> {
  //   return this.friendRepository.updateAll(friend, where);
  // }

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

  // @put('/friends/{id}')
  // @response(204, {
  //   description: 'Friend PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() friend: Friend,
  // ): Promise<void> {
  //   await this.friendRepository.replaceById(id, friend);
  // }

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


  @post('/sendFriendshipRequest')
  @response(204, {
    description: 'Send friendship request',
  })
  async sendFriendshipRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              currentUserId: {type: 'string'},
              newFriendId: {type: 'string'},
            },
            required: ['currentUserId', 'newFriendId'],
          },
        },
      },
    })
    friendshipRequestBody: {currentUserId: string, newFriendId: string}
  ): Promise<void> {
    const currentUser = await this.friendRepository.findOne({where: {userId: friendshipRequestBody.currentUserId}});
    const newFriend = await this.friendRepository.findOne({where: { userId: friendshipRequestBody.newFriendId}});
    if ( currentUser && newFriend) { //? checking that data is defined properly
      if (newFriend.friendshipRequestList) {
        const newFriendRequestList = newFriend.friendshipRequestList;
        newFriendRequestList.push(currentUser.userId);
        const newFriendBody = {
          friendshipRequestList: newFriendRequestList,
        }
        await this.friendRepository.updateById(newFriend._id, newFriendBody)
      } else {
        const newFriendBody = {
          friendshipRequestList: [currentUser.userId],
        }
        await this.friendRepository.updateById(newFriend._id, newFriendBody)
      }
    }
  }

  @post('/acceptFriendshipRequest')
  @response(204, {
    description: 'Accept friendship request',
  })
  async acceptFriendshipRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              currentUserId: {type: 'string'},
              newFriendUsername: {type: 'string'},
            },
            required: ['currentUserId', 'newFriendUsername'],
          },
        },
      },
    })
    friendshipRequestBody: {currentUserId: string, newFriendUsername: string}
  ): Promise<void> {
    //* Data
    const currentUser = await this.friendRepository.findOne({where: {userId: friendshipRequestBody.currentUserId}});
    if(!currentUser) {
      throw new HttpError(401, 'There are no user with that userId')
    }
    const currentUserData = await this.userRepository.findById(currentUser.userId);
    if (!currentUserData.username) {
      throw new HttpError(401, 'Wrong user data, property username cant be undefined')
    }

    const applicantUser =  await this.userRepository.findOne({where: {username: friendshipRequestBody.newFriendUsername}})
    if(!applicantUser) {
      throw new HttpError(401, 'There are no user with that username')
    }

    const applicantUserFriendDbEntry = await this.friendRepository.findOne({where: {userId: applicantUser?.id}});
    if(!applicantUserFriendDbEntry) {
      throw new HttpError(401, 'There are no user with that userId')
    }

    //* Subract applicant username from friendshipRequest array
    const currentUserFriendshipList = currentUser.friendshipRequestList
    const indexOfApplicantUser = currentUserFriendshipList?.indexOf(applicantUser.id)
    if(indexOfApplicantUser !== -1 && currentUserFriendshipList && typeof indexOfApplicantUser === 'number') {
      currentUserFriendshipList.splice(indexOfApplicantUser,1);
    } else {
      throw new HttpError(401, 'Applicant user did not found in friendship request list.')
    }

    //* Insert new friend in current user friend list.
    if(currentUser?.friends) {
      const currentUserFriendList = currentUser.friends;
      currentUserFriendList.push(friendshipRequestBody.newFriendUsername)
      const updatedFriendList = {
        friendshipRequestList: currentUserFriendshipList,
        friends : currentUserFriendList
      }
      await this.friendRepository.updateById(currentUser._id, updatedFriendList);
    } else {;
      const updatedFriendList = {
        friendshipRequestList: currentUserFriendshipList,
        friends : [friendshipRequestBody.newFriendUsername]
      }
      await this.friendRepository.updateById(currentUser._id, updatedFriendList);
    }

    //* Insert currentUser into newFriend friends list
    if(applicantUserFriendDbEntry?.friends) {
      const applicantUserFriendList = applicantUserFriendDbEntry?.friends;
      applicantUserFriendList.push(currentUserData.username)
      const updatedFriendList = {
        friends: applicantUserFriendList,
      }
      await this.friendRepository.updateById(applicantUserFriendDbEntry._id,updatedFriendList)
    } else {
      const updatedFriendList = {
        friends: [currentUserData.username],
      }
      await this.friendRepository.updateById(applicantUserFriendDbEntry._id,updatedFriendList)
    }
  }

  @post('/refuseFriendshipRequest')
  @response(204, {
    description: 'Refuse friendship request',
  })
  async refuseFriendshipRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              currentUserUsername: {type: 'string'},
              newFriendUsername: {type: 'string'},
            },
            required: ['currentUserUsername', 'newFriendUsername'],
          },
        },
      },
    })
    friendshipRequestBody: {currentUserUsername: string, newFriendUsername: string}
  ): Promise<void> {

  }

  @del('/deleteFriend')
  @response(204, {
    description: 'Delete friend',
  })
  async deleteFriend(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              currentUserUsername: {type: 'string'},
              newFriendUsername: {type: 'string'},
            },
            required: ['currentUserUsername', 'newFriendUsername'],
          },
        },
      },
    })
    friendshipRequestBody: {currentUserUsername: string, newFriendUsername: string}
  ): Promise<void> {

  }

  @get('/userFriends/{id}')
  @response(204, {
    description: 'Get friends',
  })
  async getFriends(
    @param.path.string('id') id: string,
  ): Promise<string[] | null> {
    const currentUser = await this.friendRepository.findById(id);
    if(!currentUser) {
      throw new HttpError(401, 'User not found');
    }
    return currentUser.friends ? currentUser.friends : null;
  }
}
