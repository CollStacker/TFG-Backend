import {expect} from '@loopback/testlab';
import {ProductCommentController} from '../../../controllers';
import {ProductComments} from '../../../models';
import {ProductCommentsRepository, ProductRepository} from '../../../repositories';
import {
  productCommentFirstExample,
  productCommentSecondExample
} from '../../data/endpointTest.data';
import {endpointTestdb} from '../../fixtures/datasources/endpointTestdb.datasource';
import {givenProductComment} from '../../helpers/endpointDatabase.helpers';

describe('Product-Comment controller test', () => {
  let productCommentController: ProductCommentController;
  let productCommentRepository: ProductCommentsRepository;
  let productRepository : ProductRepository;

  let secondProductComment: ProductComments;
  before(async () => {
    secondProductComment = await givenProductComment(productCommentSecondExample);
  });
  beforeEach(async () => {
    productCommentRepository = new ProductCommentsRepository(endpointTestdb);
    productCommentController = new ProductCommentController(productCommentRepository,productRepository);
  });

  after(async () => {
    await productCommentRepository.deleteAll();
  });

  it('Post a comment', async () => {
    const createdProductComment = await productCommentController.create(
      productCommentFirstExample,
    );
    const expectedResult = {
      _id: '2',
      content: 'testContent',
      publicationDate: '2024-06-03T08:42:34.663Z',
      userId: '00001',
      productId: '00101',
    };
    expect(createdProductComment.toJSON()).to.deepEqual(expectedResult);
  });

  it('Get comments', async () => {
    const foundedComments = await productCommentController.findById('00101');
    const expectedResult = [secondProductComment.content, 'testContent'];
    const foundedCommentsContent = foundedComments?.map(x => x.content);
    expect(foundedCommentsContent).to.deepEqual(expectedResult);
  })

  it('Deleting a comment', async () => {
    try {
      await productCommentController.deleteById('1');
      await productCommentController.findById('1');
    } catch (error) {
      expect(error.message).to.equal(
        'Entity not found: ProductComments with id "1"',
      );
    }
  })
});
