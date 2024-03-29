import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {expect} from '@loopback/testlab';
import {ProductField} from '../../../models';
import {ProductFieldRepository} from '../../../repositories';

describe('productField repository unit test', () => {
  let productFieldRepository: ProductFieldRepository;
  let productFieldData: Partial<ProductField>;
  //* Before each test create a new instance of productField class.
  beforeEach(async () => {
    productFieldRepository = new ProductFieldRepository(testdb);
    productFieldData = {_id: '1', key: 'newKey', value: 'newValue', type: 'newtype',productId: '1',};
  });

  //* When test have finished then delete all db content.
  after(async () => {
    await productFieldRepository.deleteAll();
  });

  it('Create a new productField', async () => {
    const createdProductField = await productFieldRepository.create({key: 'newKey', value: 'newValue', type: 'newtype',productId: '1',});
    expect(createdProductField.toJSON()).to.deepEqual(productFieldData);
  });

  it('Find productField by id', async () => {
    const createdProductField = await productFieldRepository.create({key: 'newKey', value: 'newValue', type: 'newtype',productId: '1',});
    const productFieldById = await productFieldRepository.findById(createdProductField._id);
    expect(productFieldById.toJSON()).to.deepEqual(createdProductField.toJSON());
  });

  it('Updates a productField', async () => {
    const createdProductField = await productFieldRepository.create({key: 'newKey', value: 'newValue', type: 'newtype',productId: '1',});
    const modifiedProductField: ProductField = {
      ...createdProductField,
      key: 'updatedKey',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object,
    };
    await productFieldRepository.updateById(createdProductField._id, modifiedProductField);
    const foundedUpdatedProductField = await productFieldRepository.findById(
      createdProductField._id,
    );
    expect(foundedUpdatedProductField.key).to.equal('updatedKey');
  });

  it('Delete a productField', async () => {
    const createdProductField = await productFieldRepository.create({key: 'newKey', value: 'newValue', type: 'newtype',productId: '1',});
    const createdProductFieldId = createdProductField._id;
    try {
      await productFieldRepository.deleteById(createdProductFieldId);
      const foundedDeleteProductField = await productFieldRepository.findById(
        createdProductField._id,
      );
      expect(foundedDeleteProductField).to.be.null();
    } catch (error) {
      expect(error.message).to.equal('Entity not found: ProductField with id "4"');
    }
  });
});
