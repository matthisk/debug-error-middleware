'use strict';

const defaultOptions = {
  disabledForXHR: true,
  disableSourceMapSupport: false,
  theme: 'okaidia'
};

module.exports.express = function stack(options) {
  const opts = Object.assign({}, defaultOptions, options);

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      "Error handling middleware should not be used in 'production'"
    );
  }

  // eslint-disable-next-line global-require
  return require('./src/middleware/express')(opts);
};

module.exports.koa = function stack(options) {
  const opts = Object.assign({}, defaultOptions, options);

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      "Error handling middleware should not be used in 'production'"
    );
  }

  // eslint-disable-next-line global-require
  return require('./src/middleware/koa')(opts);
};
