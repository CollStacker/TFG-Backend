import {injectable, inject, BindingScope} from '@loopback/core';
import { RedirectRoute, Request} from '@loopback/rest';
import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {Strategy as GoogleStrategy, StrategyOptions} from 'passport-google-oauth20';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {Profile} from 'passport';

@injectable({scope: BindingScope.TRANSIENT})
export class GoogleAuthStrategy implements AuthenticationStrategy {
  name = 'googleoauth2';

  passportstrategy: GoogleStrategy;

  constructor(
    @inject('googleOAuth2Options')
    googleOAuth2Options: StrategyOptions,
  ) {
    // console.log("Google OAuth2 options:", googleOAuth2Options);
    this.passportstrategy = new GoogleStrategy(
      googleOAuth2Options,
      this.verify.bind(this),
    );
  }

  verify(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
    // console.log("ENTRAAAA")
    const userProfile: UserProfile = {
      [securityId]: profile.id,
      name: profile.displayName,
      email: profile.emails ? profile.emails[0].value : '',
    };
    //return;
    done(null, userProfile);
  }

  async authenticate(request: Request): Promise<UserProfile | RedirectRoute | undefined> {
    // console.log("entra aqui")
    // console.log(request.body);
    // console.log(request.params);
    const strategy = new StrategyAdapter(
      this.passportstrategy,
      this.name,
    );
    // console.log(this.passportstrategy)
    // console.log(strategy.authenticate(request))
    console.log(request);
    const result = await strategy.authenticate(request);
    console.log("Resultado de authenticate:", result);
    // console.log(typeof result)
    return result;
  }
}
