## Express/Koa error handling middleware

[![Build Status](https://travis-ci.org/matthisk/debug-error-middleware.svg?branch=master)](https://travis-ci.org/matthisk/stack-middleware)

Apply this debug middleware to display context information in the response to a 
failed request.

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
var debugMiddleware = require('debug-error-middleware').express;

var app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(debugMiddleware());
}
```

**Koa**

```javascript
var debugMiddleware = require('debug-error-middleware').koa;

var app = new Koa();

if (process.env.NODE_ENV === 'development') {
  app.use(debugMiddleware());
}
```

### Source Map Support

Even though it is not desirable to run transpiled source code inside the
node js runtime, you often do not escape the use of it because of Server Side
Rendering applications. `debug-error-middleware` automatically supports sourcemaps. 
This will result in stack traces that are easier to interpret. You can disable 
source map support through a configuration option.

### Configuration

The following configuration options are available:

```javascript
{
  theme: 'okaidia', // The prismjs theme to use
  disabledForXHR: true // Disable the middleware for XHR requests
  disableSourceMapSupport: false // Disables support for sourcemaps
}
```