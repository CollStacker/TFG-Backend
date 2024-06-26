import {expect} from '@loopback/testlab';
import {givenProduct} from '../../helpers/endpointDatabase.helpers';
import {endpointTestdb} from '../../fixtures/datasources/endpointTestdb.datasource';
import {ProductRepository, CollectionRepository} from '../../../repositories';
import {ProductController} from '../../../controllers';
import {Product} from '../../../models';
import {
  productFirstExample,
  productSecondExample,
  productThirdExample,
  productFourthExample,
} from '../../data/endpointTest.data';

describe('Product controller test', () => {
  let productController: ProductController;
  let productRepository: ProductRepository;
  let collectionRepository: CollectionRepository;
  // data
  let firstProduct: Product;
  let secondProduct: Product;
  let thirdProduct: Product;
  before(async () => {
    firstProduct = await givenProduct(productFirstExample);
    secondProduct = await givenProduct(productSecondExample);
    thirdProduct = await givenProduct(productThirdExample);
  });

  beforeEach(async () => {
    productRepository = new ProductRepository(endpointTestdb);
    collectionRepository = new CollectionRepository(endpointTestdb);
    productController = new ProductController(productRepository,collectionRepository);
  });

  after(async () => {
    await productRepository.deleteAll();
  });

  it('Create new product', async () => {
    const createdProduct = await productController.create(productFourthExample);
    const expectedProduct = {
      _id: '5',
      name: 'testProduct4',
      description: 'testDesc',
      image: 'testImage',
      collectionId: '2',
      likes: 0,
    };
    expect(createdProduct.toJSON()).to.deepEqual(expectedProduct);
  });

  it('Get every product of determinated collection', async () => {
    const expectedResult = [firstProduct,secondProduct,thirdProduct];
    const foundedProducts = await productController.getCollectionProducts('1');
    expect(foundedProducts).to.deepEqual(expectedResult);
  });

  it('Update content of a determinated product', async () => {
    const newProductData: Product = {
      ...firstProduct,
      name: 'updatedProduct',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object
    }
    await productController.updateById('1', newProductData);
    const updatedProduct = await productRepository.findById('1');
    expect(updatedProduct.name).to.equal('updatedProduct');
  })

  it('Get last 20 product posted on app', async () => {
    await collectionRepository.create({title: 'ttt55',ownerId:'1111'});
    const collectionCreated = await collectionRepository.findOne({where: {title: 'ttt55'}});
    await productRepository.create({name: 'ttt', collectionId: collectionCreated?._id})
    const products = await productController.find();
    const expectedResult = [{
      _id: '6',
      name: 'ttt',
      description: undefined,
      image: null,
      publicationDate: undefined,
      ownerId: '1111',
      likes: 0
    }]
    expect(products).to.deepEqual(expectedResult);
    expect(products.length).to.equal(1);
  })

  it('Get a product by his id', async () => {
    const product = await productController.findById('6');
    expect(product).to.not.be.null();
  });

  it('Delete a product by ID', async () => {
    try {
      await productController.deleteById('4')
      await productRepository.findById('4');
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Product with id "4"');
    }
  });

  it( 'Try to get products from a collection with anyone', async () => {
    const foundedProducts = await productController.getCollectionProducts('10');
    expect(foundedProducts).to.be.null();
  });


});
