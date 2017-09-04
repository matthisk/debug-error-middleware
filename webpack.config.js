const path = require('path');

module.exports = {
  entry: './bin/koa-webpack.js', // string | object | array
  // Here the application starts executing
  // and webpack starts bundling

  output: {
    // options related to how webpack emits results

    path: path.resolve(__dirname, 'src'), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)

    filename: 'koa-webpack.js' // string
    // the filename template for entry chunks
  },

  devtool: 'source-map', // enum
  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.

  context: __dirname, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory

  target: 'node', // enum
  // the environment in which the bundle should run
  // changes chunk loading behavior and available modules

  node: {
    __dirname: true
  },

  stats: 'errors-only'
  // lets you precisely control what bundle information gets displayed
};
