// import {inject} from '@loopback/core';
// import {DefaultCrudRepository} from '@loopback/repository';
// import {MongodbDataSource} from '../datasources';
// import {UserModel, UserRelations} from '../models';
// import {compare} from 'bcrypt';
// import { UserCredentials } from '../interfaces/userCredentials.interface';
// import {securityId, UserProfile} from '@loopback/security';
// import { HttpError } from '../utils/http-error';


// export class UserRepository extends DefaultCrudRepository<
// UserModel,
//   typeof UserModel.prototype._id,
//   UserRelations
// > {
//   constructor(
//     @inject('datasources.mongodb') dataSource: MongodbDataSource,
//   ) {
//     super(UserModel, dataSource);
//   }

//   async verifyCredentials(credentials:UserCredentials): Promise <UserModel> {
//     const email = credentials.email // name must match with entry in db
//     const user = await this.findOne({where: {email}});
//     if (!user) throw new HttpError(400,'User non-existent.')  // user does not exist

//     const passwordMatch = await compare(credentials.password, user.password);
//     if (passwordMatch) {
//       return user;
//     } else {
//       throw new HttpError(400,'Password does not match.')
//     }
//   }

//   convertToUserProfile(user: UserModel): UserProfile {
//     const userProfile: UserProfile = {
//       [securityId]: user._id.toString(),
//       email: user.email,
//       name: user.name,
//     }

//     return userProfile
//   }
// }
