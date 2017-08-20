'use strict';

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const pathToTemplate = path.join(__dirname, './templates/index.html');
const template = fs.readFileSync(pathToTemplate).toString();
const renderTemplate = Handlebars.compile(template, {});

const util = require('./util');

const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);

function loadCodeMirror() {
  const p = Promise.all([
    readFile('./lib/codemirror/codemirror.js'),
    readFile('./lib/codemirror/javascript.js'),
    readFile('./lib/codemirror/codemirror.css'),
    readFile('./lib/codemirror/theme/monokai.css')
  ]);

  return p.then(args => {
    const codemirrorSRC = args[0];
    const codemirrorModeJS = args[1];
    const codemirrorStyles = args[2];
    const codemirrorTheme = args[3];
    return {
      codemirrorSRC: codemirrorSRC + codemirrorModeJS,
      codemirrorStyles: codemirrorStyles + codemirrorTheme
    };
  });
}

function parseStack(error) {
  const stack = error.stack.split('\n').slice(1);
  const regex = /at ([\w.]+) \(([^:]+):(\d+):(\d+)\)/;

  const results = Promise.all(
    stack.map(line => {
      const match = line.match(regex);

      if (!match) return undefined;

      const lineNumber = parseInt(match[3], 10);
      const column = parseInt(match[4], 10);

      const result = {
        column,
        at: match[1],
        path: match[2],
        line: lineNumber,
        fileContent: ''
      };

      return exists(result.path).then(e => {
        if (e) {
          return readFile(result.path).then(file => {
            result.fileContent = file.toString();
            result.context = {};
            result.context.lineStart = lineNumber - 10;
            result.context.lineNumber = lineNumber;
            result.context.code = result.fileContent;

            return result;
          });
        }
        return result;
      });
    })
  );

  return results.then(r => r.filter(i => i));
}

function getEnvironment() {
  return util.toKeyValueList(process.env);
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
  return util.toKeyValueList(request.headers);
}

function getRequest(request) {
  return util.toKeyValueList({
    path: request.path,
    method: request.method,
    host: request.host,
    locale: request.locale
  });
}

function getProcess() {
  return [
    { key: 'platform', value: process.platform },
    { key: 'arch', value: process.arch },
    { key: 'node_version', value: process.version },
    { key: 'cwd', value: process.cwd() },
    { key: 'execPath', value: process.execPath },
    { key: 'pid', value: process.pid },
    { key: 'mainModule', value: process.mainModule.filename },
    {
      key: 'memoryUsage',
      value: util.humanize(process.memoryUsage().heapTotal)
    }
  ];
}

module.exports = function main(opts, error, req) {
  return Promise.all([loadCodeMirror(), parseStack(error)]).then(args => {
    const codemirror = args[0];
    const stack = args[1];
    // 3: Create config for Handlebars
    let config = {
      exception: error,
      headers: getHeaders(req),
      request: getRequest(req),
      stack,
      environment: getEnvironment(),
      globals: getGlobals(),
      process: getProcess()
    };

    config = Object.assign({}, config, codemirror);

    return renderTemplate(config);
  });
};
