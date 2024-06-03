import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {expect} from '@loopback/testlab';
import {ProductComments} from '../../../models';
import {ProductCommentsRepository} from '../../../repositories';

describe('ProductComment repository unit test', () => {
  let productCommentRepository: ProductCommentsRepository;
  let productCommentData: Partial<ProductComments>;
  beforeEach(async () => {
    productCommentRepository = new ProductCommentsRepository(testdb);
    productCommentData = {
      _id: '1',
      content: 'ttt',
      publicationDate: "2024-06-03T08:41:14.831Z",
      userId: '00001',
      productId: '00101'
    };
  });

  //* When test have finished then delete all db content.
  after(async () => {
    await productCommentRepository.deleteAll();
  });

  it('Create a new product comment instance', async () => {
    const createdProductCommentInstance = await productCommentRepository.create({
      content: 'ttt',
      publicationDate: "2024-06-03T08:41:14.831Z",
      userId: '00001',
      productId: '00101'
    });
    expect(createdProductCommentInstance.toJSON()).to.deepEqual(productCommentData);
  });

  it('Find product comment entry by id', async () => {
    const createdProductCommentInstance = await productCommentRepository.create({
      content: 'ttt',
      publicationDate: "2024-06-03T08:41:14.831Z",
      userId: '00001',
      productId: '00101'
    });
    const productCommentById = await productCommentRepository.findById(createdProductCommentInstance._id);
    expect(productCommentById.toJSON()).to.deepEqual(createdProductCommentInstance.toJSON());
  });

  it('Updates a product comment entry', async () => {
    const createdProductCommentInstance = await productCommentRepository.create({
      content: 'ttt',
      publicationDate: "2024-06-03T08:41:14.831Z",
      userId: '00001',
      productId: '00101'
    });
    const modifiedProductCommentEntry: ProductComments = {
      ...createdProductCommentInstance,
      productId: '00102',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object,
    };
    await productCommentRepository.updateById(createdProductCommentInstance._id, modifiedProductCommentEntry);
    const foundedUpdatedProductComment = await productCommentRepository.findById(
      createdProductCommentInstance._id,
    );
    expect(foundedUpdatedProductComment.productId).to.deepEqual('00102');
  });

  it('Delete a productComment entry', async () => {
    const createdProductCommentInstance = await productCommentRepository.create({
      content: 'ttt',
      publicationDate: "2024-06-03T08:41:14.831Z",
      userId: '00001',
      productId: '00101'
    });
    const createdProductCommentInstanceId = createdProductCommentInstance._id;
    try {
      await productCommentRepository.deleteById(createdProductCommentInstanceId);
      const foundedDeleteProductCommentEntry = await productCommentRepository.findById(
        createdProductCommentInstance._id,
      );
      expect(foundedDeleteProductCommentEntry).to.be.null();
    } catch (error) {
      expect(error.message).to.equal('Entity not found: ProductComments with id "4"');
    }
  });
});
