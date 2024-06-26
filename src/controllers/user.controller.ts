import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  post,
  requestBody,
  del,
  response,
  param,
  patch
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {NewUserRequest} from '../models/user.model';
// eslint-disable-next-line @typescript-eslint/naming-convention
import _ from 'lodash';
import {CredentialsRequestBody} from '../utils/loginCredentials';
import {
  FriendsController,
  CollectionController,
  ProductController,
  ProductFieldController
} from '../controllers';
import {HttpError} from '../utils/http-error';
// import {parseFriendRequestBody} from '../utils/utilities';
import {compare} from 'bcrypt';
import {UserRelevantData} from '../interfaces/userRelevantData.interface';

export class UserController {
  constructor(
    @inject('controllers.FriendsController')
    protected friendsController: FriendsController,
    @inject('controllers.CollectionController')
    protected collectionController: CollectionController,
    @inject('controllers.ProductController')
    protected productController: ProductController,
    @inject('controllers.ProductFieldController')
    protected productFieldController: ProductFieldController,
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
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

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
              'x-ts-type': User,
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
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    const existingEmail = await this.userRepository.findOne({
      where: {email: newUserRequest.email},
    }); // Checking if an user with same email exists in db
    const existingUsername = await this.userRepository.findOne({
      where: {username: newUserRequest.username},
    });

    if (existingEmail != null) {
      throw new HttpError(400, 'Correo electrónico no disponible.');
    }
    if (existingUsername != null) {
      throw new HttpError(400, 'Username no disponible.');
    }

    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );
    // console.log(savedUser);

    await this.userRepository.userCredentials(savedUser.id).create({password});

    //Saving UserId in Friend table
    // await this.friendsController.create(parseFriendRequestBody(savedUser.id));
    return savedUser;
  }

  @authenticate('jwt')
  @del('/user/{id}')
  @response(204, {
    description: 'User account DELETE success.',
  })
  async deleteUser(@param.path.string('id') id: string): Promise<void> {
    // First delete all friends
    await this.friendsController.deleteFriendRelationships(id);
    await this.friendsController.deleteFriendRequestEntries(id);

    const collections = await this.collectionController.getUserCollections(id);
    if (collections) {
      for (const collection of collections) {
        if (collection._id) {
          // Delete all products of determinated collection
          const collectionProducts =
            await this.productController.getCollectionProducts(collection._id);
          if (collectionProducts) {
            for (const product of collectionProducts) {
              if (product._id) {
                // Delete product fields
                const productFields = await this.productFieldController.findById(product._id);
                if(productFields) {
                  for (const productField of productFields) {
                    if (productField._id)
                      await this.productFieldController.deleteById(productField._id)
                  }
                }
                await this.productController.deleteById(product._id);
              }
            }
          }
          // Delete all user products inside his collections
          await this.collectionController.deleteById(collection._id);
        }
      }
    }
    // Finally Delete user
    await this.userRepository.deleteById(id);
    // Also delete his entry in UserCredentials table
    await this.userRepository.userCredentials(id).delete();
  }

  @authenticate('jwt')
  @patch('/changePassword/{id}')
  async changePassword(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              currentPassword: {type: 'string'},
              newPassword: {type: 'string'},
            },
            required: ['currentPassword', 'newPassword'],
          },
        },
      },
    })
    passwordData: {currentPassword: string; newPassword: string},
  ): Promise<void> {
    const user = await this.userRepository.userCredentials(id).get();

    const currentPasswordCorrect = await compare(
      passwordData.currentPassword,
      user.password,
    );
    if (!currentPasswordCorrect) {
      throw new HttpError(401, 'Contraseña actual incorrecta');
    }

    const encryptedNewPassword = await hash(
      passwordData.newPassword,
      await genSalt(),
    );
    await this.userRepository
      .userCredentials(id)
      .patch({password: encryptedNewPassword});
  }

  @authenticate('jwt')
  @get('/userData/{email}')
  @response(204, {
    description: 'Acces to user relevant data.',
  })
  async getUserRelevantData(
    @param.path.string('email') email: string,
  ): Promise<UserRelevantData | null> {
    const user = await this.userRepository.findOne({where: {email: email}});
    if (user) {
      const relevantData: UserRelevantData = {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        surnames: user.surnames,
        biography: user.biography,
        profilePhoto: user.profilePhoto,
      };
      return relevantData;
    } else {
      return null;
      //throw new HttpError(400, 'User not found');
    }
  }

  @authenticate('jwt')
  @patch('/updateUser/{id}')
  async updateUser(
  @param.path.string('id') id: string,
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(NewUserRequest, {partial: true}),
      },
    },
  })
  user: NewUserRequest,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @authenticate('jwt')
  @get('/findUser/{username}')
  @response(204, {
    description: 'Access to user relevant data.',
  })
  async findUserByUsername(
    @param.path.string('username') username: string,
  ): Promise<UserRelevantData> {
    const user = await this.userRepository.findOne({where: {username: username}});
    if (user) {
      const relevantData: UserRelevantData = {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        surnames: user.surnames,
        biography: user.biography,
        profilePhoto: user.profilePhoto,
      };
      return relevantData;
    } else {
      throw new HttpError(400, 'User not found');
    }
  }

  @authenticate('jwt')
  @get('/findUserById/{id}')
  @response(204, {
    description: 'Acces to user relevant data.',
  })
  async findUserById(
    @param.path.string('id') id: string,
  ): Promise<UserRelevantData> {
    const user = await this.userRepository.findOne({where: {id: id}});
    if (user) {
      const relevantData: UserRelevantData = {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        surnames: user.surnames,
        biography: user.biography,
        profilePhoto: user.profilePhoto,
      };
      return relevantData;
    } else {
      throw new HttpError(400, 'User not found');
    }
  }
}
