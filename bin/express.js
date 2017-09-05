'use strict';

// eslint-disable-next-line
const express = require('express');
const debugMiddleware = require('../index').express;

const app = express();

app.use(() => {
  throw new TypeError('Converting circular structure to JSON');
});

app.use(debugMiddleware());

app.listen(3000);

console.log('[debugMiddleware] listining at 3000');
