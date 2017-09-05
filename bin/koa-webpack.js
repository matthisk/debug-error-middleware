// eslint-disable-next-line
import Koa from 'koa';
import { koa as debugMiddleware } from '../index';

const app = new Koa();

app.use(debugMiddleware());

app.use(async () => {
  throw new TypeError('Converting circular structure to JSON');
});

app.listen(3000);

console.log('[debugMiddleware] listining at 3000');
