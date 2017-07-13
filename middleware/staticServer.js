import serve from 'koa-static-server';

const staticServer = serve({ rootDir: 'public' });

export default (app, router) => {
  router
    .get(/(\/assets|.*\.css)/, (ctx) => {
      return staticServer(ctx);
    });
  app.use(router.routes());
};
