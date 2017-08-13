const defaultOptions = {
  disabledForXHR: true
};

module.exports.express = function stack(options) {
  const opts = Object.assign({}, defaultOptions, options);

  // eslint-disable-next-line global-require
  return require('./src/middleware/express')(opts);
};

module.exports.koa = function stack(options) {
  const opts = Object.assign({}, defaultOptions, options);

  // eslint-disable-next-line global-require
  return require('./src/middleware/koa')(opts);
};
