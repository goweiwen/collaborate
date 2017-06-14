import serve from 'koa-static-server';

const staticServer = serve({ rootDir: 'public' });

export default (app, router) => {
  router.get('/*', (ctx) => {
    if (ctx.isAuthenticated()) {
      return staticServer(ctx);
    }
    return ctx.redirect('/login');
  });
  app.use(router.routes());
};
