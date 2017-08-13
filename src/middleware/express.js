'use strict';

const main = require('../main');

module.exports = function stack(opts) {
  // eslint-disable-next-line no-unused-vars
  return function middleware(error, req, res, next) {
    if (opts.disabledForXHR && req.xhr) return next();

    return main(opts, error, req, res).then(html => {
      res.status(500).send(html).end();
    });
  };
};
