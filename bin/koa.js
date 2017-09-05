'use strict';

// eslint-disable-next-line
const Koa = require('koa');

const debugMiddleware = require('../index').koa;

const app = new Koa();

app.use(debugMiddleware());

app.use(async () => {
  throw new TypeError('Converting circular structure to JSON');
});

app.listen(3000);

console.log('[debugMiddleware] listining at 3000');
