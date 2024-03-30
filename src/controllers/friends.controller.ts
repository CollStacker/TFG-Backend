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


  @post('/sendFriendRequest')
  @response(204, {
    description: 'Send friend request',
  })
  async sendFriendRequest(
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
    friendRequestBody: {currentUserId: string, newFriendId: string}
  ): Promise<void> {
    const currentUser = await this.friendRepository.findOne({where: {userId: friendRequestBody.currentUserId}});
    const newFriend = await this.friendRepository.findOne({where: { userId: friendRequestBody.newFriendId}});
    if ( currentUser && newFriend) { //? checking that data is defined properly
      if (newFriend.friendRequestList) {
        const newFriendRequestList = newFriend.friendRequestList;
        newFriendRequestList.push(currentUser.userId);
        const newFriendBody = {
          friendRequestList: newFriendRequestList,
        }
        await this.friendRepository.updateById(newFriend._id, newFriendBody)
      } else {
        const newFriendBody = {
          friendRequestList: [currentUser.userId],
        }
        await this.friendRepository.updateById(newFriend._id, newFriendBody)
      }
    }
  }

  @post('/acceptFriendRequest')
  @response(204, {
    description: 'Accept friend request',
  })
  async acceptFriendRequest(
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
    friendRequestBody: {currentUserId: string, newFriendUsername: string}
  ): Promise<void> {
    //* Data
    const currentUser = await this.friendRepository.findOne({where: {userId: friendRequestBody.currentUserId}});
    if(!currentUser) {
      throw new HttpError(401, 'There are no user with that userId')
    }
    const currentUserData = await this.userRepository.findById(currentUser.userId);
    if (!currentUserData.username) {
      throw new HttpError(401, 'Wrong user data, property username cant be undefined')
    }

    const applicantUser =  await this.userRepository.findOne({where: {username: friendRequestBody.newFriendUsername}})
    if(!applicantUser) {
      throw new HttpError(401, 'There are no user with that username')
    }

    const applicantUserFriendDbEntry = await this.friendRepository.findOne({where: {userId: applicantUser?.id}});
    if(!applicantUserFriendDbEntry) {
      throw new HttpError(401, 'There are no user with that userId')
    }

    //* Subract applicant username from friendRequest array
    const currentUserFriendsList = currentUser.friendRequestList
    const indexOfApplicantUser = currentUserFriendsList?.indexOf(applicantUser.id)
    if(indexOfApplicantUser !== -1 && currentUserFriendsList && typeof indexOfApplicantUser === 'number') {
      currentUserFriendsList.splice(indexOfApplicantUser,1);
    } else {
      throw new HttpError(401, 'Applicant user did not found in friend request list.')
    }

    //* Insert new friend in current user friend list.
    if(currentUser?.friends) {
      const currentUserFriendList = currentUser.friends;
      currentUserFriendList.push(friendRequestBody.newFriendUsername)
      const updatedFriendList = {
        friendRequestList: currentUserFriendList,
        friends : currentUserFriendList
      }
      await this.friendRepository.updateById(currentUser._id, updatedFriendList);
    } else {;
      const updatedFriendList = {
        friendRequestList: currentUserFriendsList,
        friends : [friendRequestBody.newFriendUsername]
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

  @post('/refuseFriendRequest')
  @response(204, {
    description: 'Refuse friend request',
  })
  async refuseFriendRequest(
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
    friendRequestBody: {currentUserId: string, newFriendUsername: string}
  ): Promise<void> {
    //* data
    const currentUserFriendData = await this.friendRepository.findOne({where: {userId: friendRequestBody.currentUserId}});
    if (!currentUserFriendData) {
      throw new HttpError(401, 'There are not any user with that id');
    }

    const applicantUser = await this.userRepository.findOne({where: { username: friendRequestBody.newFriendUsername}});
    if (!applicantUser) {
      throw new HttpError(401, `There are not any user with username: ${applicantUser}`)
    }

    //* Refusing frien request
    if(currentUserFriendData.friendRequestList) {
      const currentUserFriendRequestList = currentUserFriendData.friendRequestList;
      const indexOfUserToDelete = currentUserFriendRequestList.indexOf(applicantUser.id);
      if (indexOfUserToDelete !== -1 && typeof indexOfUserToDelete === 'number') {
        currentUserFriendRequestList.splice(indexOfUserToDelete,1);
      }
      const updatedFriendRequestList = {
        friendRequestList: currentUserFriendRequestList,
      }
      await this.friendRepository.updateById(currentUserFriendData._id, updatedFriendRequestList);
    }
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
              currentUserId: {type: 'string'},
              friendUsername: {type: 'string'},
            },
            required: ['currentUserId', 'friendUsername'],
          },
        },
      },
    })
    friendRequestBody: {currentUserId: string, friendUsername: string}
  ): Promise<void> {
    //* Data
    const currentUserFriendData = await this.friendRepository.findOne({where: { userId: friendRequestBody.currentUserId}});
    if (!currentUserFriendData) {
      throw new HttpError(401, 'There are not any user with that id');
    }
    const currentUserData = await this.userRepository.findById(friendRequestBody.currentUserId);

    const userToDelete = await this.userRepository.findOne({where: {username: friendRequestBody.friendUsername}});
    if (!userToDelete) {
      throw new HttpError(401, `There are not any user with username: ${userToDelete}`)
    }
    const userToDeleteFriendData = await this.friendRepository.findOne({where: {userId: userToDelete.id}});
    if (!userToDeleteFriendData) {
      throw new HttpError(401, `User ${userToDelete.username} not found`)
    }

    //* Delete friend from currentUser's friends list
    const currentUserFriendList = currentUserFriendData.friends;
    if (currentUserFriendList) {
      const indexOfFriendToDelete = currentUserFriendList.indexOf(friendRequestBody.friendUsername);
      if (indexOfFriendToDelete !== -1) {
        currentUserFriendList.splice(indexOfFriendToDelete,1);
      }
    }
    const newCurrentUserFriendlist = {
      friends: currentUserFriendList
    }
    await this.friendRepository.updateById(currentUserFriendData._id,newCurrentUserFriendlist);

    //* Delete
    const deletedFriendFriendlist = userToDeleteFriendData.friends;
    if (deletedFriendFriendlist) {
      let indexOfCurrentUser: number;
      /* Always comes in this conditional,but it's implemented becouse in the
      User model (given by lb4), the property username is possibly to be null */
      if(currentUserData.username) {
        indexOfCurrentUser = deletedFriendFriendlist.indexOf(currentUserData.username);
        deletedFriendFriendlist.splice(indexOfCurrentUser,1)
      }
    }
    const newDeletedFriendFriendslist = {
      friends: deletedFriendFriendlist,
    }
    await this.friendRepository.updateById(userToDeleteFriendData._id, newDeletedFriendFriendslist)
  }

  @get('/userFriends/{id}')
  @response(204, {
    description: 'Get friends',
  })
  async getFriends(
    @param.path.string('id') id: string,
  ): Promise<string[] | null> {
    const currentUser = await this.friendRepository.findOne({where: {
      userId: id
    }});
    if(!currentUser) {
      throw new HttpError(401, 'User not found');
    }
    return currentUser.friends ? currentUser.friends : null;
  }
}
