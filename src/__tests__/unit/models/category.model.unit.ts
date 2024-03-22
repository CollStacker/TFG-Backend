import { Category } from '../../../models';
import { givenCategoryData } from '../../helpers/database.helpers'
import { expect } from '@loopback/testlab'

describe('Category model unit test', () => {
  //* Verify that category instance can be created properly
  it ('Create an instance of Category', () => {
    expect(new Category(givenCategoryData())).to.be.instanceOf(Category)
  })

  //* Testing that properties are properly setted
  it ('Assing properties correctly', () => {
    const category = new Category(givenCategoryData());
    expect(category._id).to.equal('00004');
    expect(category.name).to.equal('testCategory');
    expect(category.collectionId).to.equal('00003');
    expect(category.description).to.equal(undefined);
    expect(category.parentId).to.equal(undefined);
  })
})
