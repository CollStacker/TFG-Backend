import {Collection} from '../../../models';
import {givenCollectionData} from '../../helpers/database.helpers';
import {expect} from '@loopback/testlab';

describe('Collection model test', () => {
  //* Collection instance must be created
  it('Create collection instance', () => {
    expect(new Collection(givenCollectionData())).to.be.instanceOf(Collection);
  });

  //* Check if can be setted properties to collection model instance
  it('Assing properties correctly', () => {
    const collection = new Collection({
      _id: '00003',
      title: 'testCollection',
      description: 'testDesc',
      tag: 'testTag',
      ownerId: '00001',
    });
    expect(collection.title).to.equal('testCollection');
    expect(collection.description).to.equal('testDesc');
    expect(collection.frontPage).to.equal(undefined);
    expect(collection.tag).to.equal('testTag');
    expect(collection.ownerId).to.equal('00001');
  });
});
