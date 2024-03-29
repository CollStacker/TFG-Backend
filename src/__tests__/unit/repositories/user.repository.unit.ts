// import {testdb} from '../../fixtures/datasources/testdb.datasource';
// import {expect} from '@loopback/testlab';
// import {UserModel} from '../../../models';
// import {UserRepository} from '../../../repositories';

// describe('User repository unit test', () => {
//   let userRepository: UserRepository;
//   let userData: Partial<UserModel>;
//   //* Before each test create a new instance of user class.
//   beforeEach(async () => {
//     userRepository = new UserRepository(testdb);
//     userData = {
//       _id: '1',
//       username: 'AdrianTest01',
//       name: 'Adrian',
//       surnames: 'Glez Exp',
//       email: 'adriantest@gmail.com',
//       password: '12345678aA@',
//     };
//   });

//   //* When test have finished then delete all db content.
//   after(async () => {
//     await userRepository.deleteAll();
//   });

//   it('Create a new user', async () => {
//     const createdUser = await userRepository.create({
//       username: 'AdrianTest01',
//       name: 'Adrian',
//       surnames: 'Glez Exp',
//       email: 'adriantest@gmail.com',
//       password: '12345678aA@',
//     });
//     expect(createdUser.toJSON()).to.deepEqual(userData);
//   });

//   it('Find user by id', async () => {
//     const createdUser = await userRepository.create({
//       username: 'AdrianTest01',
//       name: 'Adrian',
//       surnames: 'Glez Exp',
//       email: 'adriantest@gmail.com',
//       password: '12345678aA@',
//     });
//     const userById = await userRepository.findById(createdUser._id);
//     expect(userById.toJSON()).to.deepEqual(createdUser.toJSON());
//   });

//   it('Updates a user', async () => {
//     const createdUser = await userRepository.create({
//       username: 'AdrianTest01',
//       name: 'Adrian',
//       surnames: 'Glez Exp',
//       email: 'adriantest@gmail.com',
//       password: '12345678aA@',
//     });
//     const modifiedUser: UserModel = {
//       ...createdUser,
//       name: 'David',
//       getId: () => {},
//       getIdObject: Object,
//       toJSON: Object,
//       toObject: Object,
//     };
//     await userRepository.updateById(createdUser._id, modifiedUser);
//     const foundedUpdatedUser = await userRepository.findById(createdUser._id);
//     expect(foundedUpdatedUser.name).to.deepEqual('David');
//   });

//   it('Delete a user', async () => {
//     const createdUser = await userRepository.create({
//       username: 'AdrianTest01',
//       name: 'Adrian',
//       surnames: 'Glez Exp',
//       email: 'adriantest@gmail.com',
//       password: '12345678aA@',
//     });
//     const createdUserId = createdUser._id;
//     try {
//       await userRepository.deleteById(createdUserId);
//       const foundedDeleteUser = await userRepository.findById(createdUser._id);
//       expect(foundedDeleteUser).to.be.null();
//     } catch (error) {
//       expect(error.message).to.equal('Entity not found: UserModel with id "4"');
//     }
//   });
// });
