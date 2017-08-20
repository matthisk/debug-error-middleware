'use strict';

// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const express = require('express');
const expect = require('chai').expect;
const request = require('request');
const cheerio = require('cheerio');
const stack = require('../index').express;

let app;
let server;

beforeEach(done => {
  app = express();

  server = app.listen(3000, done);
});

afterEach(() => {
  server.close();
});

function checkBody(body) {
  const html = cheerio.load(body);

  expect(html('title').text()).to.contain('Exception Page');
}

describe('#stack', () => {
  it('fails when NODE_ENV="production"', () => {
    process.env.NODE_ENV = 'production';

    expect(() => {
      stack();
    }).to.throw();

    process.env.NODE_ENV = undefined;
  });

  it('handles a synchronous error', done => {
    // eslint-disable-next-line no-unused-vars
    app.use((req, res, next) => {
      throw new TypeError('Hello World');
    });
    app.use(stack());

    request('http://localhost:3000/', (error, response, body) => {
      expect(response.statusCode).to.equal(500);

      checkBody(body);
      done();
    });
  });

  it('handles a async error', done => {
    app.use((req, res, next) => {
      setImmediate(() => {
        next(new TypeError('Hello World'));
      });
    });
    app.use(stack());

    request('http://localhost:3000/', (error, response, body) => {
      expect(response.statusCode).to.equal(500);
      checkBody(body);
      done();
    });
  });
});
