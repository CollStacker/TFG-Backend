import {expect} from '@loopback/testlab';
import {ProductLikeController} from '../../../controllers';
import {ProductLikeRepository, ProductRepository} from '../../../repositories';
import {
  productLikeFirstExample,
} from '../../data/endpointTest.data';
import {endpointTestdb} from '../../fixtures/datasources/endpointTestdb.datasource';

describe('Product-Like controller test', () => {
  let productLikeController: ProductLikeController;
  let productLikeRepository: ProductLikeRepository;
  let productRepository : ProductRepository;

  beforeEach(async () => {
    productLikeRepository = new ProductLikeRepository(endpointTestdb);
    productRepository = new ProductRepository(endpointTestdb);
    productLikeController = new ProductLikeController(productLikeRepository,productRepository);
  });

  after(async () => {
    await productLikeRepository.deleteAll();
  });

  it('Give a like', async () => {
    await productRepository.create({collectionId: '11111',name:'ttt', likes: 0})
    await productLikeController.create( productLikeFirstExample );
    const foundedLike = await productLikeController.checkIfUserLikedProduct('00001','1');
    const missedLike = await productLikeController.checkIfUserLikedProduct('00005','1');
    expect(foundedLike).to.equal(true);
    expect(missedLike).to.equal(false);
  });

  it('Remove a like',async () => {
    await productLikeController.unLike(productLikeFirstExample);
    const foundedLike = await productLikeController.checkIfUserLikedProduct('00001','1');
    expect(foundedLike).to.equal(false);
  })
});
