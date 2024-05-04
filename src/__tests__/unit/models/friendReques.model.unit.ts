import {FriendsRequest} from '../../../models'
import {givenFriendRequestData} from '../../helpers/database.helpers'
import {expect} from '@loopback/testlab';

describe('Friend model unit test', () => {
  //* Test to verify that one Friend instance can be created properly
  it('Create an instance of Friend', () => {
    const friend = new FriendsRequest(givenFriendRequestData());
    expect(friend).to.be.instanceOf(FriendsRequest)
  })

  //* Test to verify that properties are properly setted to user model
  it('Assingns properties correctly', () => {
    const friendData = givenFriendRequestData({userId: '0001', requestUserId :'0002'});
    const friend = new FriendsRequest(friendData)
    expect(friend.userId).not.to.equal(1110);
  })

  //* Testing that _id property is created authomatic by mongodb
  it('Does not generate _id property', () => {
    const friend = new FriendsRequest({ userId: '0001', requestUserId: '0002' });
    expect(friend._id).to.equal(undefined);
  });
})
