import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {expect} from '@loopback/testlab';
import {ProductLike} from '../../../models';
import {ProductLikeRepository} from '../../../repositories';

describe('ProductLike repository unit test', () => {
  let productLikeRepository: ProductLikeRepository;
  let productLikeData: Partial<ProductLike>;
  beforeEach(async () => {
    productLikeRepository = new ProductLikeRepository(testdb);
    productLikeData = {
      _id: '1',
      userId: '00001',
      productId: '00101'
    };
  });

  //* When test have finished then delete all db content.
  after(async () => {
    await productLikeRepository.deleteAll();
  });

  it('Create a new product like instance', async () => {
    const createdProductLikeInstance = await productLikeRepository.create({
      userId: '00001',
      productId: '00101'
    });
    expect(createdProductLikeInstance.toJSON()).to.deepEqual(productLikeData);
  });

  it('Find product like entry by id', async () => {
    const createdProductLikeInstance = await productLikeRepository.create({
      userId: '00001',
      productId: '00101'
    });
    const productLikeById = await productLikeRepository.findById(createdProductLikeInstance._id);
    expect(productLikeById.toJSON()).to.deepEqual(createdProductLikeInstance.toJSON());
  });

  it('Updates a product like entry', async () => {
    const createdProductLikeInstance = await productLikeRepository.create({
      userId: '00001',
      productId: '00101'
    });
    const modifiedProductLikeEntry: ProductLike = {
      ...createdProductLikeInstance,
      productId: '00102',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object,
    };
    await productLikeRepository.updateById(createdProductLikeInstance._id, modifiedProductLikeEntry);
    const foundedUpdatedProductLike = await productLikeRepository.findById(
      createdProductLikeInstance._id,
    );
    expect(foundedUpdatedProductLike.productId).to.deepEqual('00102');
  });

  it('Delete a productLike entry', async () => {
    const createdProductLikeInstance = await productLikeRepository.create({
      userId: '00001',
      productId: '00101'
    });
    const createdProductLikeInstanceId = createdProductLikeInstance._id;
    try {
      await productLikeRepository.deleteById(createdProductLikeInstanceId);
      const foundedDeleteProductLikeEntry = await productLikeRepository.findById(
        createdProductLikeInstance._id,
      );
      expect(foundedDeleteProductLikeEntry).to.be.null();
    } catch (error) {
      expect(error.message).to.equal('Entity not found: ProductLike with id "4"');
    }
  });
});
