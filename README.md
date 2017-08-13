## Express/Koa error handling middleware

Apply this middleware to display context information in the response to a failed 
request.

![Example Page](https://raw.githubusercontent.com/matthisk/stack-middleware/master/assets/example.png)

Currently we support these two HTTP frameworks:

* Express
* Koa

### Setup

Express

```javascript
var stack = require('stack-middleware').express;

var app = express();

app.use(stack());
```

Koa

```javascript
var stack = require('stack-middleware').koa;

var app = new Koa();

app.use(stack());
```

### Configuration

The following configuration options are available:

```javascript
{
  disabledForXHR: true // Disable the middleware for XHR requests
}
```