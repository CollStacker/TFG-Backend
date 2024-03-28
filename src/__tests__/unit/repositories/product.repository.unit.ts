import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {expect} from '@loopback/testlab';
import {Product} from '../../../models';
import {ProductRepository} from '../../../repositories';

describe('Product repository unit test', () => {
  let productRepository: ProductRepository;
  let productData: Partial<Product>;
  //* Before each test create a new instance of product class.
  beforeEach(async () => {
    productRepository = new ProductRepository(testdb);
    productData = {
      _id: '1',
      name: 'testProduct',
      image: 'testImage',
      collectionId: '00003'
    };
  });

  //* When test have finished then delete all db content.
  after(async () => {
    await productRepository.deleteAll();
  });

  it('Create a new product', async () => {
    const createdproduct = await productRepository.create({
      name: 'testProduct',
      image: 'testImage',
      collectionId: '00003'
    });
    expect(createdproduct.toJSON()).to.deepEqual(productData);
  });

  it('Find user by id', async () => {
    const createdproduct = await productRepository.create({
      name: 'testProduct',
      collectionId: '00003'
    });
    const productById = await productRepository.findById(createdproduct._id);
    expect(productById.toJSON()).to.deepEqual(createdproduct.toJSON());
  });

  it('Updates a product', async () => {
    const createdproduct = await productRepository.create({
      name: 'testProduct',
      collectionId: '00003'
    });
    const modifiedproduct: Product = {
      ...createdproduct,
      name: 'NewName',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object,
    };
    await productRepository.updateById(createdproduct._id, modifiedproduct);
    const foundedUpdatedproduct = await productRepository.findById(createdproduct._id);
    expect(foundedUpdatedproduct.name).to.equal('NewName');
  });

  it('Delete a product', async () => {
    const createdproduct = await productRepository.create({
      name: 'testProduct',
      collectionId: '00003'
    });
    const createdproductId = createdproduct._id;
    try {
      await productRepository.deleteById(createdproductId);
      const foundedDeleteproduct = await productRepository.findById(createdproductId);
      expect(foundedDeleteproduct).to.be.null();
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Product with id "4"');
    }
  })
});
