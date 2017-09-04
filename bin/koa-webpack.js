// eslint-disable-next-line
import Koa from 'koa';
import { koa as stack } from '../index';

const app = new Koa();

app.use(stack());

app.use(async () => {
  throw new TypeError('Converting circular structure to JSON');
});

app.listen(3000);

console.log('[stack] listining at 3000');
