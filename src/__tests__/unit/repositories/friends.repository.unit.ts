import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {expect} from '@loopback/testlab';
import {Friend} from '../../../models';
import {FriendRepository} from '../../../repositories';

describe('Friend repository unit test', () => {
  let friendRepository: FriendRepository;
  let friendData: Partial<Friend>;
  //* Before each test create a new instance of friend class.
  beforeEach(async () => {
    friendRepository = new FriendRepository(testdb);
    friendData = {
      _id: '1',
      userId: '1',
      friendId: '2',
    };
  });

  //* When test have finished then delete all db content.
  after(async () => {
    await friendRepository.deleteAll();
  });

  it('Create a new friend', async () => {
    const createdFriend = await friendRepository.create({
      userId: '1',
      friendId: '2',
    });
    expect(createdFriend.toJSON()).to.deepEqual(friendData);
  });

  it('Find user by id', async () => {
    const createdFriend = await friendRepository.create({
      userId: '1',
      friendId: '2',
    });
    const friendById = await friendRepository.findById(createdFriend._id);
    expect(friendById.toJSON()).to.deepEqual(createdFriend.toJSON());
  });

  it('Updates a friend', async () => {
    const createdFriend = await friendRepository.create({
      userId: '1',
      friendId: '2',
    });
    const modifiedFriend: Friend = {
      ...createdFriend,
      friendId: '3',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object,
    };
    await friendRepository.updateById(createdFriend._id, modifiedFriend);
    const foundedUpdatedFriend = await friendRepository.findById(
      createdFriend._id,
    );
    expect(foundedUpdatedFriend.friendId).to.deepEqual('3');
  });

  it('Delete a friend', async () => {
    const createdFriend = await friendRepository.create({
      userId: '1',
      friendId: '2',
    });
    const createdFriendId = createdFriend._id;
    try {
      await friendRepository.deleteById(createdFriendId);
      const foundedDeleteFriend = await friendRepository.findById(
        createdFriend._id,
      );
      expect(foundedDeleteFriend).to.be.null();
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Friend with id "4"');
    }
  });
});
