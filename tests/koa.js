const Koa = require('koa');
const expect = require('chai').expect;
const request = require('request');
const cheerio = require('cheerio');
const stack = require('../index').koa;

let app;
let server;

beforeEach(done => {
  app = new Koa();

  app.use(stack());

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
