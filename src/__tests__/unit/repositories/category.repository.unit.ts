import {testdb} from '../../fixtures/datasources/testdb.datasource';
// import { givenCategoryData } from '../../helpers/database.helpers';
import {Category} from '../../../models';
import {CategoryRepository} from '../../../repositories';
import {expect} from '@loopback/testlab';

describe('Category repository unit test', () => {
  let categoryRepository: CategoryRepository;
  let categoryData: Partial<Category>;
  //* Before each test create a new instance of categoryRepository class.
  beforeEach(async () => {
    categoryRepository = new CategoryRepository(testdb);
    categoryData = {
      _id: '2',
      name: 'testCategory',
      collectionId: '2',
    };
  });

  //* When test have finished then delete all db content.
  after(async () => {
    await categoryRepository.deleteAll();
  });

  it('Create a new category', async () => {
    const createdCategory = await categoryRepository.create({
      name: 'testCategory',
      description: undefined,
      collectionId: '2',
      parentId: undefined,
    });
    expect(createdCategory.toJSON()).to.deepEqual(categoryData);
  });

  it('Find user by id', async () => {
    const createdCategory = await categoryRepository.create({
      name: 'testCategory',
      description: undefined,
      collectionId: '2',
      parentId: undefined,
    });
    const categoryById = await categoryRepository.findById(createdCategory._id);
    expect(categoryById.toJSON()).to.deepEqual(createdCategory.toJSON());
  });

  it('Updates a category', async () => {
    const createdCategory = await categoryRepository.create({name: 'testCategory',description: undefined,collectionId: '2',parentId: undefined});
    const modifiedCategory: Category = {
      ...createdCategory,
      name: 'NewName',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object,
    };
    await categoryRepository.updateById(createdCategory._id, modifiedCategory);
    const foundedUpdatedCategory = await categoryRepository.findById(createdCategory._id);
    expect(foundedUpdatedCategory.name).to.equal('NewName');
  });

  it('Delete a category', async () => {
    const createdCategory = await categoryRepository.create({name: 'testCategory',description: undefined,collectionId: '2',parentId: undefined});
    const createdCategoryId = createdCategory._id;
    try {
      await categoryRepository.deleteById(createdCategoryId);
      const foundedDeleteCategory = await categoryRepository.findById(createdCategoryId);
      expect(foundedDeleteCategory).to.be.null();
    } catch (error) {
      expect(error.message).to.equal('Entity not found: Category with id "5"');
    }
  })
});
