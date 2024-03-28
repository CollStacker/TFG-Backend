/* eslint-disable @typescript-eslint/no-unused-vars */
// import {CollStacker} from '../..';
// import {endpointTestdb} from '../fixtures/datasources/endpointTestdb.datasource';
// import {Client, createRestAppClient, expect} from '@loopback/testlab';
// import {givenEmptyEndpointDatabase} from '../helpers/endpointDatabase.helpers';
// import {
//   givenCollection,
//   givenCategory,
// } from '../helpers/endpointDatabase.helpers';
// import {
//   categoryFirstExample,
//   categorySecondExample,
//   categoryThirdExample,
//   categoryFourthExample,
//   collectionExample,
// } from '../data/endpointTest.data';

// let app: CollStacker;
// let client: Client;

// describe('Category acceptance', () => {
//   before(givenEmptyEndpointDatabase);
//   before(givenRunningApp);
//   after(async () => {
//     await app.stop();
//   });

//   it('Get every category of determinated collection', async () => {
//     //data
//     const collection = await givenCollection(collectionExample);
//     const firstCategory = await givenCategory(categoryFirstExample);
//     const secondCategory = await givenCategory(categorySecondExample);
//     const thirdCategory = await givenCategory(categoryThirdExample);
//     const fourthCategory = await givenCategory(categoryFourthExample);

//     const expectedResult = [
//       firstCategory,
//       secondCategory,
//       thirdCategory,
//       fourthCategory,
//     ];

//     const response = await client.get('/categories/bycollection/1');

//     expect(response.body).to.deepEqual(expectedResult);
//   });
// });

// async function givenRunningApp() {
//   app = new CollStacker({
//     rest: {
//       port: 3000,
//     },
//   });
//   await app.boot();

//   app.dataSource(endpointTestdb);
//   await app.start();

//   client = createRestAppClient(app);
// }
