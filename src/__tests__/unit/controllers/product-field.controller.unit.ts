import {expect} from '@loopback/testlab';
import {ProductFieldController} from '../../../controllers';
import {ProductField} from '../../../models';
import {ProductFieldRepository} from '../../../repositories';
import {
  productFieldFirstExample,
  productFieldSecondExample,
  productFieldThirdExample,
} from '../../data/endpointTest.data';
import {endpointTestdb} from '../../fixtures/datasources/endpointTestdb.datasource';
import {givenProductField} from '../../helpers/endpointDatabase.helpers';

describe('Product-field controller test', () => {
  let productFieldController: ProductFieldController;
  let productFieldRepository: ProductFieldRepository;

  let secondProductField: ProductField;
  let thirdProductField: ProductField;
  before(async () => {
    secondProductField = await givenProductField(productFieldSecondExample);
    thirdProductField = await givenProductField(productFieldThirdExample);
  });
  beforeEach(async () => {
    productFieldRepository = new ProductFieldRepository(endpointTestdb);
    productFieldController = new ProductFieldController(productFieldRepository);
  });

  after(async () => {
    await productFieldRepository.deleteAll();
  });

  it('Create a productField entry', async () => {
    const createdProductField = await productFieldController.create(
      productFieldFirstExample,
    );
    const expectedResult = {
      _id: '3',
      key: 'testKey1',
      value: 'testValue',
      type: 'testType',
      productId: '2',
    };
    expect(createdProductField.toJSON()).to.deepEqual(expectedResult);
  });

  it('Create multiple productField entries', async () => {
    const createdProductField = await productFieldController.createMany(
      [productFieldFirstExample,productFieldFirstExample],
    );
    expect(createdProductField.length).to.equal(2);
  });

  it('Find every custom field from a determianted product', async () => {
    const expectedCustomFields = [secondProductField, thirdProductField];
    const foundedCustomFields = await productFieldController.findById('1');
    expect(foundedCustomFields).to.deepEqual(expectedCustomFields);
  });

  it('Delete a Product Field entry', async () => {
    try {
      await productFieldController.deleteById('1');
      await productFieldController.findById('1');
    } catch (error) {
      expect(error.message).to.equal(
        'Entity not found: ProductField with id "1"',
      );
    }
  });

  it('Finding a unexist product fields', async () => {
    const foundedProductFields = await productFieldController.findById('10');
    expect(foundedProductFields).to.be.null();
  });
});
