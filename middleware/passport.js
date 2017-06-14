import passport from 'koa-passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

const GOOGLE_CLIENT_ID = '988996499797-tuq14tf6r4gh6hsghjop99o3is6nlt13.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'wNxB5QD5W_x5CfbhNjvaVMJ-';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/login/callback',
}, (accessToken, refreshToken, profile, done) => done(null, profile.email)));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default (app, router) => {
  app.use(passport.initialize());
  app.use(passport.session());

  router.get('/login', passport.authenticate('google', {
    scope: ['email'],
  }));

  router.get('/login/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));
};
