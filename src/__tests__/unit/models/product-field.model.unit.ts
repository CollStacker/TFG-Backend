import {ProductField} from '../../../models'
import {givenProductFieldData} from '../../helpers/database.helpers'
import {expect} from '@loopback/testlab';

describe('ProductField model unit test', () => {
  //* Test to verify that one productField instance can be created properly

  after(async () => {
    
  })

  it('Create an instance of productField', () => {
    const productField = new ProductField(givenProductFieldData());
    expect(productField).to.be.instanceOf(ProductField)
  })

  //* Test to verify that properties are properly setted to user model
  it('Assingns properties correctly', () => {
    const productFieldData = givenProductFieldData({key: 'newKey', value: 'newValue', type: 'newtype',productId: '1'});
    const productField = new ProductField(productFieldData)
    expect(productField.key).not.to.equal('key');
    expect(productField.value).to.eql('newValue');
  })

  //* Testing that _id property is created authomatic by mongodb
  it('Does not generate _id property', () => {
    const productField = new ProductField({key: 'newKey', value: 'newValue', type: 'newtype',productId: '1'});
    expect(productField._id).to.equal(undefined);
  });
})
