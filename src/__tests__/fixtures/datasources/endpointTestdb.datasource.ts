import {juggler} from '@loopback/repository'

export const endpointTestdb: juggler.DataSource = new juggler.DataSource({
  name: 'mongodb', //! Same name as develop database
  connector: 'memory',
});
