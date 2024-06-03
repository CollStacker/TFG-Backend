import {ProductComments} from '../../../models'
import {givenProductCommentData} from '../../helpers/database.helpers'
import {expect} from '@loopback/testlab';

describe('ProductField model unit test', () => {
  //* Test to verify that one productField instance can be created properly

  after(async () => {

  })

  it('Create an instance of productField', () => {
    const productField = new ProductComments(givenProductCommentData());
    expect(productField).to.be.instanceOf(ProductComments)
  })

  //* Test to verify that properties are properly setted to user model
  it('Assingns properties correctly', () => {
    const productFieldData = givenProductCommentData({content:'test', publicationDate: new Date().toISOString(), userId: '00001', productId: '00101'});
    const productField = new ProductComments(productFieldData)
    expect(productField.content).not.to.equal('tttttt');
    expect(productField.userId).to.eql('00001');
  })

  //* Testing that _id property is created authomatic by mongodb
  it('Does not generate _id property', () => {
    const productField = new ProductComments({content:'test', publicationDate: new Date().toISOString(), userId: '00001', productId: '00101'});
    expect(productField._id).to.equal(undefined);
  });
})
