'use strict';

const express = require('express');
const stack = require('../index').express;

const app = express();

app.use(() => {
  throw new TypeError('Converting circular structure to JSON');
});

app.use(stack());

app.listen(3000);

console.log('[stack] listining at 3000');
