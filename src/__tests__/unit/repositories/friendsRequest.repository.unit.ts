import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {expect} from '@loopback/testlab';
import {FriendsRequest} from '../../../models';
import {FriendsRequestRepository} from '../../../repositories';

describe('Friend repository unit test', () => {
  let friendsRequestRepository: FriendsRequestRepository;
  let friendData: Partial<FriendsRequest>;
  //* Before each test create a new instance of friend class.
  beforeEach(async () => {
    friendsRequestRepository = new FriendsRequestRepository(testdb);
    friendData = {
      _id: '1',
      userId: '1',
      requestUserId: '2',
    };
  });

  //* When test have finished then delete all db content.
  after(async () => {
    await friendsRequestRepository.deleteAll();
  });

  it('Create a new friend', async () => {
    const createdFriend = await friendsRequestRepository.create({
      userId: '1',
      requestUserId: '2',
    });
    expect(createdFriend.toJSON()).to.deepEqual(friendData);
  });

  it('Find user by id', async () => {
    const createdFriend = await friendsRequestRepository.create({
      userId: '1',
      requestUserId: '2',
    });
    const friendById = await friendsRequestRepository.findById(createdFriend._id);
    expect(friendById.toJSON()).to.deepEqual(createdFriend.toJSON());
  });

  it('Updates a friend', async () => {
    const createdFriend = await friendsRequestRepository.create({
      userId: '1',
      requestUserId: '2',
    });
    const modifiedFriend: FriendsRequest = {
      ...createdFriend,
      requestUserId: '3',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object,
    };
    await friendsRequestRepository.updateById(createdFriend._id, modifiedFriend);
    const foundedUpdatedFriend = await friendsRequestRepository.findById(
      createdFriend._id,
    );
    expect(foundedUpdatedFriend.requestUserId).to.deepEqual('3');
  });

  it('Delete a friend', async () => {
    const createdFriend = await friendsRequestRepository.create({
      userId: '1',
      requestUserId: '2',
    });
    const createdrequestUserId = createdFriend._id;
    try {
      await friendsRequestRepository.deleteById(createdrequestUserId);
      const foundedDeleteFriend = await friendsRequestRepository.findById(
        createdFriend._id,
      );
      expect(foundedDeleteFriend).to.be.null();
    } catch (error) {
      expect(error.message).to.equal('Entity not found: FriendsRequest with id "4"');
    }
  });
});
