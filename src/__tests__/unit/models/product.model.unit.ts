import {Product} from '../../../models';
import {givenProductData} from '../../helpers/database.helpers';
import {expect} from '@loopback/testlab';

describe('Product model test', () => {
  //* Create a product instance must be possible
  it('Create product instance', () => {
    expect(new Product(givenProductData())).to.be.instanceOf(Product);
  });

  //* Checking if its possible to set properties to a Product model instance
  it('Assign properties correctly', () => {
    const product = new Product({
      _id: '00005',
      name: 'testProduct',
      description: 'testDescription',
      releaseYear: '22/03/2024',
      brand: 'testBrand',
      collectionId: '00003',
    });
    expect(product.name).to.equal('testProduct');
    expect(product.description).to.equal('testDescription');
    expect(product.image).to.be.eql(undefined);
    expect(product.releaseYear).to.equal('22/03/2024');
    expect(product.brand).to.equal('testBrand');
    expect(product.collectionId).to.equal('00003');
  });
});
