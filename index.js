"use strict";

const Koa = require("koa");
const fs = require("fs");
const util = require("util");
const Handlebars = require("handlebars");
const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);

const template = fs.readFileSync("./index.html").toString();
const renderTemplate = Handlebars.compile(template, {});

const app = new Koa();

async function parseStack(error) {
  const stack = error.stack.split("\n").slice(1);
  const regex = /at\ ([\w.]+)\ \(([^:]+)\:(\d+):(\d+)\)/;

  const results = await Promise.all(
    stack.map(async line => {
      const match = line.match(regex);

      if (!match) return undefined;

      const lineNumber = parseInt(match[3], 10);
      const column = parseInt(match[4], 10);

      const result = {
        column,
        at: match[1],
        path: match[2],
        line: lineNumber,
        fileContent: ""
      };

      if (await exists(result.path)) {
        result.fileContent = (await readFile(result.path)).toString();
        result.context = result.fileContent
          .split("\n")
          .slice(lineNumber - 10, lineNumber + 10)
          .map((l, i) => ({
            active: lineNumber - 10 + i + 1 === lineNumber,
            line: lineNumber - 10 + i,
            text: l
          }));
      }

      return result;
    })
  );

  return results.filter(i => i);
}

function getEnvironment() {
  return toKeyValueList(process.env);
}

function getGlobals() {
  return Object.keys(global)
    .map(key => ({
      key,
      value: `${global[key]}`
    }))
    .sort((a, b) => a.key.toLowerCase() > b.key.toLowerCase());
}

function getHeaders(request) {
  return toKeyValueList(request.headers);
}

function toKeyValueList(object) {
  return Object.keys(object)
    .map(key => ({
      key,
      value: object[key] || "&nbsp;"
    }))
    .sort((a, b) => a.key.toLowerCase() > b.key.toLowerCase());
}

function getRequest(request) {
  return toKeyValueList({
    path: request.path,
    method: request.method,
    host: request.host,
    locale: request.locale
  });
}

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = 500;
    ctx.body = renderTemplate({
      exception: error,
      headers: getHeaders(ctx.request),
      request: getRequest(ctx.request),
      stack: await parseStack(error),
      environment: getEnvironment(),
      globals: getGlobals()
    });

    // ctx.body = error.stack;

    // ctx.body += "\n";

    // Object.keys(global).forEach(key => {
    //   ctx.body += `${key}: ${global[key]}\n\n`;
    // });
  }
});

app.use(async (ctx, next) => {
  throw new TypeError("Converting circular structure to JSON");
});

app.listen(3000);
