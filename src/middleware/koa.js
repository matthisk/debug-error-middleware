'use strict';

const main = require('../main');

module.exports = function stack(opts) {
  return async function middleware(ctx, next) {
    if (opts.disabledForXHR && ctx.request.xhr) return next();

    try {
      await next();
    } catch (error) {
      const html = await main(opts, error, ctx.req, ctx.res);

      ctx.status = 500;
      ctx.body = html;
    }

    return null;
  };
};
