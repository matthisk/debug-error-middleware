const fs = require('fs');
const path = require('path');
const SourceMapConsumer = require('source-map').SourceMapConsumer;

const stripProtocol = require('./util').stripProtocol;
const getLastLine = require('./util').getLastLine;

const patt = /^\/\/# sourceMappingURL=(.*)$/;

function parseSourceMap(input) {
  const result = Object.assign({}, input);
  const context = result.context;
  const content = result.fileContent;

  const match = getLastLine(content).match(patt);

  if (match) {
    const dirName = path.dirname(input.path);
    const sourceMapLocation = path.join(dirName, match[1]);

    const sm = JSON.parse(fs.readFileSync(sourceMapLocation));

    const sources = sm.sources.map(stripProtocol);
    const sourceMap = new SourceMapConsumer(sm);

    const original = sourceMap.originalPositionFor({
      line: context.lineNumber,
      column: result.column
    });

    if (original && original.source) {
      // const index = sources.indexOf(original.source);
      const source = stripProtocol(original.source);
      const index = sources
        .map((s, i) => (s.endsWith(source) ? i : -1))
        .reduce((mem, x) => (x > -1 ? x : -1), -1);

      // console.log('sources', sources);

      if (index < 0) {
        console.error(
          [
            'Something is off with the sourcemap',
            `Can not find source of '${source}' in your sourcemap`,
            ''
          ].join('\n')
        );
        return result;
      }

      const originalContent = sm.sourcesContent[index];

      context.lineStart = Math.max(original.line - 10, 0);
      context.lineNumber = original.line;

      result.path = original.source;
      result.line = original.line;
      result.column = original.column;

      context.code = originalContent
        .split('\n')
        .slice(context.lineStart, original.line + 10)
        .join('\n');
    }
  }

  return result;
}

module.exports = {
  parseSourceMap
};
