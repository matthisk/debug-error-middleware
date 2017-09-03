const expect = require('chai').expect;
const stripProtocol = require('./util').stripProtocol;
const getLastLine = require('./util').getLastLine;

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
