// import {Friend} from '../../../models'
// import {givenFriendData} from '../../helpers/database.helpers'
// import {expect} from '@loopback/testlab';

// describe('Friend model unit test', () => {
//   //* Test to verify that one Friend instance can be created properly
//   it('Create an instance of Friend', () => {
//     const friend = new Friend(givenFriendData());
//     expect(friend).to.be.instanceOf(Friend)
//   })

//   //* Test to verify that properties are properly setted to user model
//   it('Assingns properties correctly', () => {
//     const friendData = givenFriendData({userId: '0001', friends: ['0002','0003']});
//     const friend = new Friend(friendData)
//     expect(friend.userId).not.to.equal(1110);
//     expect(friend.friends).to.eql(['0002','0003']);
//   })

//   //* Testing that _id property is created authomatic by mongodb
//   it('Does not generate _id property', () => {
//     const friend = new Friend({ userId: '0001' });
//     expect(friend._id).to.equal(undefined);
//   });
// })
