const Koa = require('koa');

const stack = require('../index').koa;

const app = new Koa();

app.use(stack());

app.use(async (ctx, next) => {
  throw new TypeError('Converting circular structure to JSON');
});

app.listen(3000);

console.log('[stack] listining at 3000');