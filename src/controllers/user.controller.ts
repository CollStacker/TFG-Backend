import {authenticate, TokenService} from '@loopback/authentication';
import {
  //Credentials,
  MyUserService,
  TokenServiceBindings,
  //User,
  // UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import lodash from 'lodash';
import {UserModel} from '../models';
import { UserRepository } from '../repositories/user.repository';
import { HttpError } from '../utils/http-error';
import {CredentialsRequestBody} from '../utils/loginCredentials'
import {FriendsController} from './friends.controller'
import {parseFriendRequestBody} from '../utils/utilities'
import { UserCredentials } from '../interfaces/userCredentials.interface';

export class UserController {
  constructor(
    //Friend controller
    @inject('controllers.FriendsController')
    protected friendsController: FriendsController,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: UserCredentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userRepository.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userRepository.convertToUserProfile(user)

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': UserModel,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserModel, {
            title: 'NewUser',
            exclude: ['_id'],
          }),
        },
      },
    })
    newUserRequest: UserModel,
  ): Promise<UserModel> {

    const existingUser = await this.userRepository.findOne({where: {email: newUserRequest.email}}) // Checking if an user with same email exists in db

    if (existingUser != null) {
      throw new HttpError(400,'Correo electrónico ya existente.')
    }


    const password = await hash(newUserRequest.password, await genSalt());  // Encrypting password

    newUserRequest.password = password;// Seting hashed password

    const savedUser: UserModel = await this.userRepository.create(
      lodash.omit(newUserRequest, '_id'),
      );

    //Saving UserId in Friend table
    await this.friendsController.create(parseFriendRequestBody(savedUser._id))

    return savedUser;
  }

  //* DELETE USER ACCOUNT
}
