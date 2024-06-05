import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

// ---------- IMPORTS TO VALIDATE AUTHENTICATION IN THE APP -------------
import {AuthenticationComponent,registerAuthenticationStrategy} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  //SECURITY_SCHEME_SPEC,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {MongodbDataSource} from './datasources';
// ----------------------------------------------------------------------
import { SocketIoServer } from '@loopback/socketio';
import { WebsocketChatController } from './controllers';

//! Google
import {GoogleAuthStrategy} from './providers/auth-strategy.provider';

export {ApplicationConfig};

export class CollStacker extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {

  socketServer: SocketIoServer;

  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(MongodbDataSource, UserServiceBindings.DATASOURCE_NAME);

    //* WEBSOCKET INITIALIZATION
    this.socketServer = new SocketIoServer(this);
    this.socketServer.route(WebsocketChatController);

    //! Google
    this.bind('googleOAuth2Options').to({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'https://tfg-backend-production-4dda.up.railway.app/auth/google/callback',
      scope: ['profile', 'email']
    });
    registerAuthenticationStrategy(this, GoogleAuthStrategy);
  }
}
