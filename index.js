"use strict";

const Koa = require("koa");
const fs = require("fs");
const Handlebars = require("handlebars");

const template = fs.readFileSync("./index.html").toString();
const renderTemplate = Handlebars.compile(template, {});

const util = require("./src/util");

const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);

const app = new Koa();

async function loadCodeMirror() {
  const codemirrorSRC = await readFile('./lib/codemirror/codemirror.js');
  const codemirrorModeJS = await readFile('./lib/codemirror/javascript.js');
  const codemirrorStyles = await readFile('./lib/codemirror/codemirror.css');
  const codemirrorTheme = await readFile('./lib/codemirror/theme/monokai.css');

  return {
    codemirrorSRC: codemirrorSRC + codemirrorModeJS,
    codemirrorStyles: codemirrorStyles + codemirrorTheme,
  };
}

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
        result.context = {};
        result.context.lineStart = lineNumber - 10;
        result.context.lineNumber = lineNumber;
        result.context.code = result.fileContent;
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

function getProcess() {
  return [
    { key: "platform", value: process.platform },
    { key: "arch", value: process.arch },
    { key: "node_version", value: process.version },
    { key: "cwd", value: process.cwd() },
    { key: "execPath", value: process.execPath },
    { key: "pid", value: process.pid },
    { key: "mainModule", value: process.mainModule.filename },
    {
      key: "memoryUsage",
      value: util.humanize(process.memoryUsage().heapTotal)
    }
  ];
}

async function setup() {
  const codemirror = await loadCodeMirror();

  app.use(async (ctx, next) => {
    try {
      // 1: Try to run code
      await next();
      // 2: Catch error
    } catch (error) {
      // 3: Create config for Handlebars
      let config = {
        exception: error,
        headers: getHeaders(ctx.request),
        request: getRequest(ctx.request),
        stack: await parseStack(error),
        environment: getEnvironment(),
        globals: getGlobals(),
        process: getProcess()
      };

      config = Object.assign({}, config, codemirror);

      // 4: Render a 500 page with Handlebars
      ctx.status = 500;
      ctx.body = renderTemplate(config);
    }
  });

  app.use(async (ctx, next) => {
    throw new TypeError("Converting circular structure to JSON");
  });

  app.listen(3000);
}

setup();