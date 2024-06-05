/* eslint-disable @typescript-eslint/naming-convention */
import {inject} from '@loopback/core';
import {get, Request, RestBindings, Response} from '@loopback/rest';
import axios from 'axios';
// import {HttpErrors} from '@loopback/rest';
import { UserController } from './user.controller';

import { TokenService} from '@loopback/authentication';
import {
  User,
  TokenServiceBindings,
  MyUserService,
  UserServiceBindings,
} from '@loopback/authentication-jwt';

export class AuthController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject('controllers.UserController') protected userController: UserController,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE) public userService: MyUserService,
  ) {}

  @get('/auth/google')
  async loginViaGoogle(): Promise<void> {
    const googleAuthURL = process.env.GOOGLE_AUTH_URL;
    this.res.redirect(googleAuthURL as string);
  }

  @get('/auth/google/callback')
  async loginCallback(@inject(RestBindings.Http.REQUEST) req: Request): Promise<void> {
    const code = req.query.code as string;
    if (!code) {
      this.res.status(400).send('Missing code parameter');
      return;
    }

    try {
      // Intercambia el código por un token de acceso
      const params = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: 'https://tfg-backend-production-4dda.up.railway.app/auth/google/callback',
        grant_type: 'authorization_code',
      };
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, { params});
      // console.log("token:"+JSON.stringify(tokenResponse.data))
      const { access_token } = tokenResponse.data;
      // console.log(access_token);
      // Obtén la información del usuario con el token de acceso
      const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // console.log(userResponse);
      const userProfile = userResponse.data;
      // console.log('Perfil de usuario:', userProfile);
      // console.log(userProfile.email)
      const userData = await this.userController.getUserRelevantData(userProfile.email);
      // console.log(userData)

      if(userData !== null) {

        const userToUser: User = {
          id: userData.id,
          email: userData.email,
          userCredentials: {
            password: '',
            id: userData.id,
            userId: userData.id,
            getId: () => userData.id,
            getIdObject: () => userData.id,
            toJSON: () => userData.id,
            toObject: () => userData.id,
          },
          getId: () => userData.id,
          getIdObject: () => userData.id,
          toJSON: () => userData.id,
          toObject: () => userData.id,
        };

        const userProfileChecked = this.userService.convertToUserProfile(userToUser);
        const token = await this.jwtService.generateToken(userProfileChecked);

        // insetar el token en user data
        const userWithToken = {
          ...userData,
          token,
        };

        const frontendURL = `https://dapper-sopapillas-02c8f2.netlify.app/?user=${encodeURIComponent(JSON.stringify(userWithToken))}`;
        this.res.redirect(frontendURL);
      }
      this.res.status(404).send('User not found')
    } catch (error) {
      // console.error('Error al obtener el token o la información del usuario:');
      this.res.status(500).send('Error al obtener el token o la información del usuario');
    }
  }
}
