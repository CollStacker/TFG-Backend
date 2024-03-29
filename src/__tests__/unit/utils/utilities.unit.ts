import { parseFriendRequestBody } from '../../../utils/utilities';
import {expect} from '@loopback/testlab';

describe ('Utilities unit tests', () => {

  it('Parse userId string into a Friend model type', () => {
    const userIdType = parseFriendRequestBody('1');
    expect(userIdType).to.deepEqual({
      userId: '1',
      getId: () => {},
      getIdObject: Object,
      toJSON: Object,
      toObject: Object
    })
  })
})
