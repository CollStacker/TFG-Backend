import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {expect} from '@loopback/testlab';
import {Collection} from '../../../models';
import {CollectionRepository} from '../../../repositories';

describe('Collection repository unit test', () => {
  let collectionRepository: CollectionRepository;
  let collectionData: Partial<Collection>;
  //* Before each test create a new instance of collection class.
  beforeEach(async () => {
    collectionRepository = new CollectionRepository(testdb);
    collectionData = {
      _id: '1',
      title: 'testCollection',
      description: 'testDescription',
      tag: 'testTag',
      frontPage: 'testFrontPage',
      ownerId: '00001',
    };
  });

  //* When test have finished then delete all db content.
  after(async () => {
    await collectionRepository.deleteAll();
  });

  it('Create a new collection', async () => {
    const createdCollection = await collectionRepository.create({
      title: 'testCollection',
      description: 'testDescription',
      tag: 'testTag',
      frontPage: 'testFrontPage',
      ownerId: '00001',
    });
    expect(createdCollection.toJSON()).to.deepEqual(collectionData);
  });

  it('Find collection by id', async () => {
    const createdCollection = await collectionRepository.create({
      title: 'testCollection',
      description: 'testDescription',
      tag: 'testTag',
      frontPage: 'testFrontPage',
      ownerId: '00001',
    });
    const collectionById = await collectionRepository.findById(createdCollection._id);
    expect(collectionById.toJSON()).to.deepEqual(createdCollection.toJSON());
  });

  it('Updates a collection', async () => {
    const createdCollection = await collectionRepository.create({
      title: 'testCollection',
      description: 'testDescription',
      tag: 'testTag',
      frontPage: 'testFrontPage',
      ownerId: '00001',
    });
    const modifiedCollection: Collection = {
      ...createdCollection,
      tag: 'updatedTag',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object,
    };
    await collectionRepository.updateById(createdCollection._id, modifiedCollection);
    const foundedUpdatedCollection = await collectionRepository.findById(
      createdCollection._id,
    );
    expect(foundedUpdatedCollection.tag).to.deepEqual('updatedTag');
  });

  it('Delete a collection', async () => {
    const createdCollection = await collectionRepository.create({
      title: 'testCollection',
      description: 'testDescription',
      tag: 'testTag',
      frontPage: 'testFrontPage',
      ownerId: '00001',
    });
    const createdCollectionId = createdCollection._id;
    try {
      await collectionRepository.deleteById(createdCollectionId);
      const foundedDeleteCollection = await collectionRepository.findById(
        createdCollection._id,
      );
      expect(foundedDeleteCollection).to.be.null();
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Collection with id "4"');
    }
  });
});
