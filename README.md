## Express/Koa error handling middleware

[![Build Status](https://travis-ci.org/matthisk/stack-middleware.svg?branch=master)](https://travis-ci.org/matthisk/stack-middleware)

Apply this middleware to display context information in the response to a failed 
request.

![Example Page](https://raw.githubusercontent.com/matthisk/stack-middleware/master/assets/example.png)

Currently we support these two HTTP frameworks:

* Express
* Koa

### Setup

Never enable the DEBUG middleware in a production environment. This could result
in leaking sensitive information (e.g. ENV variables). The middleware throws an
error if you try to load it when `NODE_ENV` is set to `"production"`.

**Express**

The debug middleware should be loaded first so we can catch errors from all 
other middleware.

```javascript
var stack = require('stack-middleware').express;

var app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(stack());
}
```

**Koa**

```javascript
var stack = require('stack-middleware').koa;

var app = new Koa();

if (process.env.NODE_ENV === 'development') {
  app.use(stack());
}
```

### Configuration

The following configuration options are available:

```javascript
{
  disabledForXHR: true // Disable the middleware for XHR requests
}
```