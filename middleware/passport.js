import passport from 'koa-passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../credentials';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/login/callback',
}, (accessToken, refreshToken, profile, done) => done(null, { user: profile.email, photo: profile.photos[0].value })));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default (app, router) => {
  app.use(passport.initialize());
  app.use(passport.session());

  router.get('/login', passport.authenticate('google', {
    scope: ['email'],
  }));

  router.get('/login/callback', passport.authenticate('google', {
    failureRedirect: '/login',
  }), ctx => ctx.redirect(ctx.session.redirectTo));
};
