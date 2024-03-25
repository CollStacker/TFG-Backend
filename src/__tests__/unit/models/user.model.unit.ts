import {UserModel} from '../../../models';
import {givenUserData} from '../../helpers/database.helpers';
import {expect} from '@loopback/testlab';

describe('User model unit test', () => {
  //* Create an user instance must be possible
  it('Create user instance', () => {
    expect(new UserModel(givenUserData())).to.be.instanceOf(UserModel);
  });

  //* Checking if set properties to userModel works
  it('Assing properties to userModel', () => {
    const user = new UserModel({
      _id: '00001',
      username: 'AdrianTest01',
      name: 'Adrian',
      surnames: 'Glez Exp',
      email: 'adriantest@gmail.com',
      password: '12345678aA@',
    });
    expect(user.username).to.equal('AdrianTest01');
    expect(user.name).to.equal('Adrian');
    expect(user.surnames).to.equal('Glez Exp');
    expect(user.email).to.equal('adriantest@gmail.com');
    expect(user.password).to.equal('12345678aA@');
  });
});
