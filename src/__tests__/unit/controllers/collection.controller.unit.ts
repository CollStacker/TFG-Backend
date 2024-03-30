import {
  collectionFirstExample,
  collectionSecondExample,
  collectionThirdExample,
} from '../../data/endpointTest.data';
import {expect} from '@loopback/testlab';
import {endpointTestdb} from '../../fixtures/datasources/endpointTestdb.datasource';
import { Collection } from '../../../models';
import { CollectionController } from '../../../controllers';
import { CollectionRepository } from '../../../repositories';
import { givenCollection } from '../../helpers/endpointDatabase.helpers';

describe('Collection controller test', () => {
  let collectionController: CollectionController;
  let collectionRepository: CollectionRepository;

  // data
  let firstCollection: Collection;
  let secondCollection: Collection;
  before(async () => {
    firstCollection = await givenCollection(collectionFirstExample);
    secondCollection = await givenCollection(collectionSecondExample);
  });

  beforeEach(async () => {
    collectionRepository = new CollectionRepository(endpointTestdb);
    collectionController = new CollectionController(collectionRepository);
  });

  after(async () => {
    await collectionRepository.deleteAll();
  });

  it('Post a collection', async () => {
    const createdCollection = await collectionController.create(collectionThirdExample);
    const expectedResult = {
      _id: '3',
      title: 'testTitle',
      description: 'testDesc',
      tag: 'testTag',
      frontPage: 'fp',
      ownerId: '2'
    }
    expect(createdCollection.toJSON()).to.deepEqual(expectedResult);
  });

  it('Get every collections of a determinated user', async () => {
    const expectedCollections = [firstCollection,secondCollection];
    const foundedCollections =  await collectionController.getUserCollections('1')
    expect(expectedCollections).to.deepEqual(foundedCollections);
  })

  it ('Try to found collections of one user that does not have one', async () => {
    const foundedCollection = await collectionController.getUserCollections('10');
    expect(foundedCollection).to.be.null();
  })

  it('Update collection property', async () => {
    const newCollection = {
      ...collectionThirdExample,
      description: 'newDescr'
    };
    await collectionController.updateById('3',newCollection);
    const updatedCollection = await collectionRepository.findById('3');
    expect(updatedCollection.description).to.equal('newDescr');
  })

  it('Delete entry from collection database', async () => {
    try {
      await collectionController.deleteById('3');
      await collectionRepository.findById('3');
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Collection with id "3"')
    }
  })
})
