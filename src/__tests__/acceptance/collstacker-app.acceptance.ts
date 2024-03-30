import { CollStacker } from '../../application';
import { main } from '../../index';
import { expect } from '@loopback/testlab';

describe('CollStacker Application', () => {
  let app: CollStacker;

  before(async () => {
    app = await main();
  });

  after(async () => {
    await app.stop();
  });

  it('should start the application', async () => {
    expect(app).to.not.be.undefined();
    // await app.boot();
    // await app.start();
    expect(app.restServer.url).to.be.not.empty();
  });

});
