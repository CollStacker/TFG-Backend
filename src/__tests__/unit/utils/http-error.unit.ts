import { HttpError } from '../../../utils/http-error';
import { expect } from '@loopback/testlab';

describe('HTTP ERROR class unit tests', () => {
  const SuccHttpError = new HttpError(200, 'Succesful tests');
  const missHttpError = new HttpError(500, `Error message`);

  it('Succesful http result', () => {
    expect(SuccHttpError.statusCode).to.equal(200);
    expect(SuccHttpError.message).to.equal('Succesful tests');
  })

  it('Unsuccesful http result', () => {
    expect(missHttpError.statusCode).to.equal(500);
    expect(missHttpError.message).to.equal(`Error message`);
  })
})
