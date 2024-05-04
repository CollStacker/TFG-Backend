import {endpointTestdb} from '../../fixtures/datasources/endpointTestdb.datasource';
// import { givenFriend } from '../../helpers/endpointDatabase.helpers';
import {expect} from '@loopback/testlab';
import {FriendsController} from '../../../controllers';
import {FriendRepository,FriendsRequestRepository} from '../../../repositories';
import {UserRepository,} from '@loopback/authentication-jwt';
import {UserCredentialsRepository} from '@loopback/authentication-jwt';
// import { Friend } from '../../../models';
import {
  // friendFirstExample,
  // friendSecondExample,
  // friendThirdExample,
  // friendFourthExample,
  // userFirstExample,
  // userSecondExample,
  // userThirdExample,
} from '../../data/endpointTest.data';

describe('Friends controller test', () => {
  let friendController: FriendsController;
  let friendRepository: FriendRepository;
  let userRepository: UserRepository;
  let friendRequestRepository: FriendsRequestRepository;

  beforeEach(async () => {
    const userCredentialsRepository = new UserCredentialsRepository(
      endpointTestdb,
    );
    userRepository = new UserRepository(
      endpointTestdb,
      async () => userCredentialsRepository,
    );
    friendRepository = new FriendRepository(endpointTestdb);
    friendRequestRepository = new FriendsRequestRepository(endpointTestdb)
    friendController = new FriendsController(userRepository, friendRepository, friendRequestRepository);
  });

  after(async () => {
    await friendRepository.deleteAll();
  });

  it('Send friend request', async () => {
    const friendRequestBody = {
      userId: '1',
      requestUserId: '2',
    };
    const createdFriendRequest = await friendController.sendFriendRequest(
      friendRequestBody,
    );
    const expectedResult = {
      _id: '1',
      userId: '1',
      requestUserId: '2',
    };
    expect(createdFriendRequest.toJSON()).to.deepEqual(expectedResult);
  })

  it('Try to send a request that already exist', async () => {
    const friendRequestBody = {
      userId: '1',
      requestUserId: '2',
    };
    try {
      await friendController.sendFriendRequest(friendRequestBody);
    } catch (error) {
      expect(error.message).to.be.equal('Error!. Friend request already exists.');
    }
  })

  it('Refuse friend request', async () => {
    const friendRequestBody = {
      userId: '2',
      requestUserId: '1',
    };
    await friendController.refuseFriendRequest(friendRequestBody);
    const foundedRequest = await friendRequestRepository.findOne({where: {userId: friendRequestBody.userId, requestUserId: friendRequestBody.requestUserId}});
    expect(foundedRequest).to.be.null();
  })

  it(' Accepting wrong friend request', async () => {
    const friendRequestBody = {
      userId: '1',
      requestUserId: '2',
    };
    try{
      await friendController.acceptFriendRequest(friendRequestBody);
    } catch (error) {
      expect(error.message).to.be.equal('Error!. There aren`t any request for that user');
    }
  })

  it('Accept friend request', async () => {
    const friendRequestBody = {
      userId: '1',
      requestUserId: '2',
    };
    await friendController.sendFriendRequest(friendRequestBody);
    await friendController.acceptFriendRequest({userId: '2', requestUserId: '1'});
    const foundedFriend = await friendRepository.findOne({where: {userId: friendRequestBody.requestUserId, friendId: friendRequestBody.userId}});
    const expectedResult = {
      _id: '1',
      userId: '2',
      friendId: '1',
    };
    expect(foundedFriend ? foundedFriend.toJSON() : '').to.deepEqual(expectedResult);
  })

  it('Delete friend', async () => {
    await friendController.deleteFriend({userId: '2', friendId: '1'});
    const foundedFriend = await friendRepository.findOne({where: {userId: '2', friendId: '1'}});
    expect(foundedFriend).to.be.null();

    const friendRequestBody = {
      userId: '1',
      requestUserId: '2',
    };
    await friendController.sendFriendRequest(friendRequestBody);
    await friendController.acceptFriendRequest({userId: '2', requestUserId: '1'});
    await friendController.deleteFriend({userId: '1', friendId: '2'});
    const foundedFriendSecond = await friendRepository.findOne({where: {userId: '1', friendId: '2'}});
    expect(foundedFriendSecond).to.be.null();
  })

  it('Try to delete friend that does not exist', async () => {
    try {
      await friendController.deleteFriend({userId: '2', friendId: '1'});
    } catch (error) {
      expect(error.message).to.be.equal('Error!. There aren`t any entry for that users');
    }
  });

  it('Delete friend relationshipts after deleting user', async () => {
    const friendRequestBody = {
      userId: '1',
      requestUserId: '2',
    };
    const friendRequestBody2 = {
      userId: '2',
      requestUserId: '1',
    };
    await friendController.sendFriendRequest(friendRequestBody);
    await friendController.sendFriendRequest(friendRequestBody2);
    await friendController.acceptFriendRequest({userId: '2', requestUserId: '1'});
    await friendController.acceptFriendRequest({userId: '1', requestUserId: '2'});
    await friendController.deleteFriendRelationships('1');
    const foundedFriend = await friendRepository.findOne({where: {userId: '1', friendId: '2'}});
    expect(foundedFriend).to.be.null();
  });

  it('Delete friend requests when deleting a user', async () => {
    const friendRequestBody = {
      userId: '5',
      requestUserId: '6',
    };
    const friendRequestBody2 = {
      userId: '6',
      requestUserId: '5',
    };
    await friendController.sendFriendRequest(friendRequestBody);
    await friendController.sendFriendRequest(friendRequestBody2);
    await friendController.deleteFriendRequestEntries('6');
    const foundedFriendRequest = await friendRequestRepository.findOne({where: {userId: '6'}});
    expect(foundedFriendRequest).to.be.null();
  })

  it('Get friend requests', async () => {
    const friendRequestBody = {
      userId: '7',
      requestUserId: '8',
    };
    await friendController.sendFriendRequest(friendRequestBody);
    const foundedFriendRequest = await friendController.getFriendRequest('8');
    const expectedResult = {
      _id: '8',
      userId: '7',
      requestUserId: '8',
    };
    expect(foundedFriendRequest ? foundedFriendRequest[0].toJSON() : '').to.deepEqual(expectedResult);
    const foundedFriendRequestNull = await friendController.getFriendRequest('20');
    expect(foundedFriendRequestNull).to.be.deepEqual([]);
  })

  it('Get friends', async () => {
    const friendRequestBody = {
      userId: '9',
      requestUserId: '10',
    };
    const secondFriendRequestBody = {
      userId: '10',
      requestUserId: '11',
    }
    await friendController.sendFriendRequest(friendRequestBody);
    await friendController.sendFriendRequest(secondFriendRequestBody);
    await friendController.acceptFriendRequest({userId: '10', requestUserId: '9'});
    await friendController.acceptFriendRequest({userId: '11', requestUserId: '10'});
    const foundedFriends = await friendController.getFriends('10');
    const expectedResult = ['9','11'];
    expect(foundedFriends).to.deepEqual(expectedResult);
  })

});
