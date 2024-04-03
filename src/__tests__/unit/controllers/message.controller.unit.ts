import {endpointTestdb} from '../../fixtures/datasources/endpointTestdb.datasource';
import {expect} from '@loopback/testlab';
import {MessageController} from '../../../controllers';
import {MessageRepository} from '../../../repositories';
import {
  message1Example,
  message2Example,
  message3Example,
  message4Example,
} from '../../data/endpointTest.data';

describe('Message controller unit tests', () => {
  let messageController: MessageController;
  let messageRepository: MessageRepository;

  beforeEach( async () => {
    messageRepository = new MessageRepository(endpointTestdb);
    messageController = new MessageController(messageRepository);
  });

  after(async () => {
    await messageRepository.deleteAll();
  });

  it('Post a message', async () => {
    const firstMessage = await messageController.create(message1Example)
    const secondMessage = await messageController.create(message2Example)
    const thirdMessage = await messageController.create(message3Example)
    const fourthMessage = await messageController.create(message4Example)
    expect(firstMessage._id).to.equal('1');
    expect(secondMessage.content).to.equal('message 2')
    expect(thirdMessage.receiverId).to.equal('1')
    expect(fourthMessage.senderId).to.equal('2')
  })

  it('Get full conversation of two users by his ids', async() => {
    const conversation = await messageController.getConversation({senderId: '1', receiverId: '2'});
    expect(conversation.length).to.equal(4)
    expect(conversation[0].content).to.equal('message 4')
  })

  it('Delete a conversation', async () => {
    await messageController.deleteConversation({senderId: '1', receiverId: '2'})
    const conversation = await messageController.getConversation({senderId: '1', receiverId: '2'});
    expect(conversation.length).to.eql(0)
  })

})
