import Koa from 'koa';
import serve from 'koa-static-server';

const app = new Koa();

app.use(serve({ rootDir: 'dist' }));

app.listen(3000);
console.log('Listening on port 3000');
