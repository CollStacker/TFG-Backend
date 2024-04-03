import {Message} from '../../../models'
import {givenMessageData} from '../../helpers/database.helpers'
import {expect} from '@loopback/testlab';

describe('Message model unit test', () => {
  //* Test to verify that one Message instance can be created properly
  it('Create an instance of Message', () => {
    const message = new Message(givenMessageData());
    expect(message).to.be.instanceOf(Message)
  })

  //* Test to verify that properties are properly setted to user model
  it('Assingns properties correctly', () => {
    const messageData = givenMessageData({
      content: 'testMessage',
      senderId: '1',
      receiverId: '2',
    },);
    const message = new Message(messageData)
    expect(message.senderId).not.to.equal('2');
    expect(message.content).to.eql('testMessage');
  })

  //* Testing that _id property is created authomatic by mongodb
  it('Does not generate _id property', () => {
    const message = new Message({ content: 'test' });
    expect(message._id).to.equal(undefined);
  });
})
