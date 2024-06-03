import {ProductLike} from '../../../models'
import {givenProductLikeData} from '../../helpers/database.helpers'
import {expect} from '@loopback/testlab';

describe('ProductField model unit test', () => {
  //* Test to verify that one productField instance can be created properly

  after(async () => {

  })

  it('Create an instance of productField', () => {
    const productField = new ProductLike(givenProductLikeData());
    expect(productField).to.be.instanceOf(ProductLike)
  })

  //* Test to verify that properties are properly setted to user model
  it('Assingns properties correctly', () => {
    const productFieldData = givenProductLikeData({userId: '00001', productId: '00101'});
    const productField = new ProductLike(productFieldData)
    expect(productField.userId).not.to.equal('key');
    expect(productField.productId).to.eql('00101');
  })

  //* Testing that _id property is created authomatic by mongodb
  it('Does not generate _id property', () => {
    const productField = new ProductLike({userId: '00001', productId: '00101'});
    expect(productField._id).to.equal(undefined);
  });
})
