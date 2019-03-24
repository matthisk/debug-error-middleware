'use strict';

// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const Koa = require('koa');
const expect = require('chai').expect;
const request = require('request');
const cheerio = require('cheerio');
const stack = require('../index').koa;

let app;
let server;

function checkBody(body) {
  const html = cheerio.load(body);

  expect(html('title').text()).to.contain('Exception Page');
}

function checkEnvVarsInclude(body, envVar) {
  const html = cheerio.load(body);

  expect(html('div.environment').text()).to.contain(envVar);
}

function checkEnvVarsExclude(body, envVar) {
  const html = cheerio.load(body);

  expect(html('div.environment').text()).to.not.contain(envVar);
}

describe('#stack with default config', () => {
  beforeEach(done => {
    app = new Koa();

    app.use(stack());

    server = app.listen(3000, done);
  });

  afterEach(() => {
    server.close();
  });

  it('fails when NODE_ENV="production"', () => {
    process.env.NODE_ENV = 'production';

    expect(() => {
      stack();
    }).to.throw();

    process.env.NODE_ENV = undefined;
  });

  it('handles a synchronous error', done => {
    app.use(async () => {
      throw new TypeError('Hello World');
    });

    request('http://localhost:3000/', (error, response, body) => {
      expect(response.statusCode).to.equal(500);

      checkBody(body);
      done();
    });
  });
});

describe('#stack with custom excludeEnvVariables config', () => {
  const testEnvVarName = 'TEST_ENV_VAR';

  beforeEach(done => {
    app = new Koa();
    process.env[testEnvVarName] = 'Hello World';
    done();
  });

  afterEach(() => {
    server.close();
  });

  it('has env variable when not excluded', done => {
    app.use(stack());
    server = app.listen(3000);

    app.use(async () => {
      throw new TypeError('Hello World');
    });

    request('http://localhost:3000/', (error, response, body) => {
      expect(response.statusCode).to.equal(500);

      checkBody(body);
      checkEnvVarsInclude(body, testEnvVarName);
      done();
    });
  });

  it('miss env variable when excluded', done => {
    const excluded = [];
    excluded.push(testEnvVarName);

    app.use(
      stack({
        excludeEnvVariables: excluded
      })
    );
    server = app.listen(3000);

    app.use(async () => {
      throw new TypeError('Hello World');
    });

    request('http://localhost:3000/', (error, response, body) => {
      expect(response.statusCode).to.equal(500);

      checkBody(body);
      checkEnvVarsExclude(body, testEnvVarName);
      done();
    });
  });
});
