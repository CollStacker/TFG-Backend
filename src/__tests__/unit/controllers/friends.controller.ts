import {endpointTestdb} from '../../fixtures/datasources/endpointTestdb.datasource';
// import { givenFriend } from '../../helpers/endpointDatabase.helpers';
import {expect} from '@loopback/testlab';
import {FriendsController} from '../../../controllers';
import {FriendRepository} from '../../../repositories';
import {UserRepository} from '@loopback/authentication-jwt';
import {UserCredentialsRepository} from '@loopback/authentication-jwt';
// import { Friend } from '../../../models';
import {
  friendFirstExample,
  friendSecondExample,
  friendThirdExample,
  friendFourthExample,
  userFirstExample,
  userSecondExample,
  userThirdExample,
} from '../../data/endpointTest.data';

describe('Friends controller test', () => {
  let friendController: FriendsController;
  let friendRepository: FriendRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const userCredentialsRepository = new UserCredentialsRepository(
      endpointTestdb,
    );
    userRepository = new UserRepository(
      endpointTestdb,
      async () => userCredentialsRepository,
    );
    friendRepository = new FriendRepository(endpointTestdb);
    friendController = new FriendsController(userRepository, friendRepository);
  });

  after(async () => {
    await friendRepository.deleteAll();
  });

  it('Create a friend entry', async () => {
    const createdFriend = await friendController.create(friendFirstExample);
    const expectedResult = {
      _id: '1',
      userId: '1',
      friends: ['2', '3'],
    };
    expect(createdFriend.toJSON()).to.deepEqual(expectedResult);
  });

  it('Get a friend entry by ID from the bbdd', async () => {
    const foundedFriend = await friendController.findById('1');
    expect(foundedFriend._id).to.equal('1');
    expect(foundedFriend.userId).to.equal('1');
    expect(foundedFriend.friends).to.deepEqual(['2', '3']);
  });

  it('Update friend entry', async () => {
    const updatedFriend = {
      ...friendFirstExample,
      friends: ['1', '1', '1'],
    };
    await friendController.updateById('1', updatedFriend);
    expect(updatedFriend.friends).to.deepEqual(['1', '1', '1']);
  });

  it('Delete a friend entry', async () => {
    try {
      await friendController.deleteById('1');
      await friendController.findById('1');
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Friend with id "1"');
    }
  });

  it('Delete a friend entry when an user account have been deleted', async () => {
    await friendRepository.create(friendFirstExample);
    try {
      await friendController.deleteUserEntry('1');
      await friendRepository.findById('1');
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Friend with id "1"');
    }
  });

  it('Trying to delete friend entry giving non exist id', async () => {
    try {
      await friendController.deleteUserEntry('10');
    } catch (error) {
      expect(error.message).to.equal(
        'There are not any entry in the db for that user.',
      );
    }
  });

  it('Testing friendship request behaviour', async () => {
    //* Users
    await userRepository.create(userFirstExample);
    await userRepository.create(userSecondExample);
    await userRepository.create(userThirdExample);
    //* Friends db entries
    await friendRepository.create(friendSecondExample);
    await friendRepository.create(friendThirdExample);
    await friendRepository.create(friendFourthExample);
    //* Send friendship request when friendRequestArray empty
    await friendController.sendFriendshipRequest({
      currentUserId: '10',
      newFriendId: '11',
    });
    const foundedFriendList = await friendRepository.findOne({
      where: {userId: '11'},
    });
    if (foundedFriendList) {
      expect(foundedFriendList.friendshipRequestList).to.deepEqual(['10']);
    }
    //* Send friendship request when friendRequestArray with one or more friendship requests inside
    await friendController.sendFriendshipRequest({
      currentUserId: '12',
      newFriendId: '11',
    });
    const updatedFriendList = await friendRepository.findOne({
      where: {userId: '11'},
    });
    if (updatedFriendList) {
      expect(updatedFriendList.friendshipRequestList).to.deepEqual([
        '10',
        '12',
      ]);
    }
  });

  it('Accept friendship request', async () => {
    await friendController.acceptFriendshipRequest({
      currentUserId: '11',
      newFriendUsername: 'AdrianTest',
    });
    const currentUserFriendshipData = await friendRepository.findOne({
      where: {userId: '11'},
    });
    const newFriendFriendshiptData = await friendRepository.findOne({
      where: {userId: '10'},
    });
    expect(currentUserFriendshipData?.friendshipRequestList).not.to.containDeep(
      '10',
    );
    expect(currentUserFriendshipData?.friends).to.deepEqual(['AdrianTest']);
    expect(newFriendFriendshiptData?.friends).to.deepEqual(['ttt']);
  });

  it('Refuse friendship request', async () => {
    await friendController.refuseFriendshipRequest({
      currentUserId: '11',
      newFriendUsername: 'tttt',
    });
    const currentUserFriendshipData = await friendRepository.findOne({
      where: {userId: '11'},
    });
    expect(currentUserFriendshipData?.friendshipRequestList).not.to.containDeep(
      '12',
    );
  });

  it('Get all friends of determinated user', async () => {
    const everyCurrentFriends = await friendController.getFriends('11');
    expect(everyCurrentFriends).to.deepEqual(['AdrianTest']);
  });

  it('Get all friends from a unexist user', async () => {
    try {
      await friendController.getFriends('16');
    } catch (error) {
      expect(error.message).to.equal('User not found');
    }
  });

  it('Delete friend', async () => {
    await friendController.deleteFriend({
      currentUserId: '11',
      friendUsername: 'AdrianTest',
    });
    const currentUserFriendshipData = await friendRepository.findOne({
      where: {userId: '11'},
    });
    expect(currentUserFriendshipData?.friends).not.to.containDeep('AdrianTest');
  });
});
