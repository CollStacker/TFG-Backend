import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {expect} from '@loopback/testlab';
import {Message} from '../../../models';
import {MessageRepository} from '../../../repositories';

describe('Message repository unit test', () => {
  let messageRepository: MessageRepository;
  let messageData: Partial<Message>;
  //* Before each test create a new instance of message class.
  beforeEach(async () => {
    messageRepository = new MessageRepository(testdb);
    messageData = {
      _id: '1',
      content: 'testMessage',
      senderUser: '1',
      receiverUser: '2',
    };
  });

  //* When test have finished then delete all db content.
  after(async () => {
    await messageRepository.deleteAll();
  });

  it('Create a new message', async () => {
    const createdMessage = await messageRepository.create({
      content: 'testMessage',
      senderUser: '1',
      receiverUser: '2',
    });
    expect(createdMessage.toJSON()).to.deepEqual(messageData);
  });

  it('Find message by id', async () => {
    const createdMessage = await messageRepository.create({
      content: 'testMessage',
      senderUser: '1',
      receiverUser: '2',
    });
    const messageById = await messageRepository.findById(createdMessage._id);
    expect(messageById.toJSON()).to.deepEqual(createdMessage.toJSON());
  });

  it('Updates a message', async () => {
    const createdMessage = await messageRepository.create({
      content: 'testMessage',
      senderUser: '1',
      receiverUser: '2',
    });
    const modifiedMessage: Message = {
      ...createdMessage,
      content: 'modified',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object,
    };
    await messageRepository.updateById(createdMessage._id, modifiedMessage);
    const foundedUpdatedMessage = await messageRepository.findById(
      createdMessage._id,
    );
    expect(foundedUpdatedMessage.content).to.deepEqual('modified');
  });

  it('Delete a message', async () => {
    const createdMessage = await messageRepository.create({
      content: 'testMessage',
      senderUser: '1',
      receiverUser: '2',
    });
    const createdMessageId = createdMessage._id;
    try {
      await messageRepository.deleteById(createdMessageId);
      const foundedDeleteMessage = await messageRepository.findById(
        createdMessage._id,
      );
      expect(foundedDeleteMessage).to.be.null();
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Message with id "4"');
    }
  });
});
