const expect = require('chai').expect;
const stripProtocol = require('./util').stripProtocol;
const getLastLine = require('./util').getLastLine;
const indexOfEndsWith = require('./util').indexOfEndsWith;

describe('test strip path', () => {
  it('webpack url', () => {
    const result = stripProtocol(
      'webpack:///./node_modules/some/path/to/file.js'
    );

    expect(result).to.equal('/./node_modules/some/path/to/file.js');
  });

  it('browserify url', () => {
    const result = stripProtocol(
      'browserify:///./node_modules/some/path/to/file.js'
    );

    expect(result).to.equal('/./node_modules/some/path/to/file.js');
  });

  it('without prefix', () => {
    const result = stripProtocol('node_modules/some/path/to/file.js');

    expect(result).to.equal('node_modules/some/path/to/file.js');
  });
});

describe('getLastLine', () => {
  it('std', () => {
    const result = getLastLine(
      ['hello world', 'this is not it', 'yes I am the last line'].join('\n')
    );

    expect(result).to.equal('yes I am the last line');
  });
  it('one line', () => {
    const result = getLastLine(['hello world'].join('\n'));

    expect(result).to.equal('hello world');
  });
});

describe('indexOfEndsWith', () => {
  it('std', () => {
    const index = indexOfEndsWith('node_modules/bin/koa.js', [
      'webpack:///./node_modules/bin/express.js',
      'webpack:///./node_modules/bin/koa.jsx',
      'webpack:///./node_modules/bin/koa.js',
      'webpack:///./node_modules/middleware/koa.js'
    ]);

    expect(index).to.equal(2);
  });

  it('full string', () => {
    const index = indexOfEndsWith('node_modules/bin/koa.js', [
      'node_modules/bin/express.js',
      'node_modules/bin/koa.jsx',
      'node_modules/bin/koa.js',
      'node_modules/middleware/koa.js'
    ]);

    expect(index).to.equal(2);
  });

  it('not found', () => {
    const index = indexOfEndsWith('node_modules/bin/test.js', [
      'webpack:///./node_modules/bin/express.js',
      'webpack:///./node_modules/bin/koa.jsx',
      'webpack:///./node_modules/bin/koa.js',
      'webpack:///./node_modules/middleware/koa.js'
    ]);

    expect(index).to.equal(-1);
  });
});
