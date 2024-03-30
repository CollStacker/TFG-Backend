import { CategoryController } from '../../../controllers';
import { CategoryRepository } from '../../../repositories';
import { Category } from '../../../models';
import { testdb } from '../../fixtures/datasources/testdb.datasource';
import { expect } from '@loopback/testlab'

describe('Category controller test', () => {
  let categoryController: CategoryController;
  let categoryRepository: CategoryRepository;
  const expectedData = {
    _id: '1',
    name: 'testCategory',
    description: 'testDescription',
    collectionId: '1',
  }

  beforeEach(async () => {
    categoryRepository = new CategoryRepository(testdb);
    categoryController = new CategoryController(categoryRepository);
  });

  after(async () => {
    await categoryRepository.deleteAll();
  });

  it('Creates a new category', async () => {
    const categoryData:Omit<Category, "_id"> = {
      name: 'testCategory',
      description: 'testDescription',
      collectionId: '1',
      parentId: undefined,
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object
    }
    const createdCategory = await categoryController.create(categoryData);
    expect(createdCategory.toJSON()).to.deepEqual(expectedData);
  });

  it('Get every category of determinated collection', async () => {
    const foundedCategories = await categoryController.getCollectionCategories('1');
    if (foundedCategories) {
      expect(foundedCategories[0].toJSON()).to.deepEqual(expectedData)
    } else {
      expect(foundedCategories).to.be.null();
    }
  })

  it('Delete one category from the database', async () => {
    try {
      await categoryController.deleteById('1');
      await categoryRepository.findById('1');
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Category with id "1"')
    }
  })

  it( 'Try to get categories from a collection with anyone', async () => {
    const foundedCategories = await categoryController.getCollectionCategories('10');
    expect(foundedCategories).to.be.null();
  })

})
