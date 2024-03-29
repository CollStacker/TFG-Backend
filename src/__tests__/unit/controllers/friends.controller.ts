import {endpointTestdb} from '../../fixtures/datasources/endpointTestdb.datasource';
// import { givenFriend } from '../../helpers/endpointDatabase.helpers';
import {expect} from '@loopback/testlab';
import { FriendsController } from '../../../controllers';
import { FriendRepository } from '../../../repositories';
// import { Friend } from '../../../models';
import {
  friendFirstExample
} from '../../data/endpointTest.data';


describe('Friends controller test', () => {
  let friendController: FriendsController;
  let friendRepository: FriendRepository;

  beforeEach(async () => {
    friendRepository = new FriendRepository(endpointTestdb);
    friendController = new FriendsController(friendRepository);
  });

  after(async () => {
    await friendRepository.deleteAll();
  });

  it('Create a friend entry', async () => {
    const createdFriend = await friendController.create(friendFirstExample);
    const expectedResult = {
      _id : '1',
      userId: '1',
      friends: [ '2', '3' ]
    }
    expect(createdFriend.toJSON()).to.deepEqual(expectedResult);
  })

  it('Get a friend entry by ID from the bbdd', async () => {
    const foundedFriend = await friendController.findById('1');
    expect(foundedFriend._id).to.equal('1');
    expect(foundedFriend.userId).to.equal('1');
    expect(foundedFriend.friends).to.deepEqual([ '2', '3' ]);
  })

  it('Update friend entry', async () => {
    const updatedFriend = {
      ...friendFirstExample,
      friends: ['1','1','1']
    }
    await friendController.updateById('1',updatedFriend);
    expect(updatedFriend.friends).to.deepEqual(['1','1','1']);
  })

  it('Delete a friend entry', async () => {
    try {
      await friendController.deleteById('1');
      await friendController.findById('1');
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Friend with id "1"')
    }
  })
});
