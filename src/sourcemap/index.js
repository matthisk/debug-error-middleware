'use strict';

const fs = require('fs');
const path = require('path');
const SourceMapConsumer = require('source-map').SourceMapConsumer;

const stripProtocol = require('./util').stripProtocol;
const getLastLine = require('./util').getLastLine;
const indexOfEndsWith = require('./util').indexOfEndsWith;

const patt = /^\/\/# sourceMappingURL=(.*)$/;

function parseSourceMap(input) {
  const result = Object.assign({}, input);
  const code = result.code;

  const match = getLastLine(code).match(patt);

  if (match) {
    let sm;
    const dirName = path.dirname(input.path);
    const sourceMapLocation = path.join(dirName, match[1]);

    try {
      sm = JSON.parse(fs.readFileSync(sourceMapLocation));
    } catch (err) {
      console.error(
        [`Unable to locate sourcemap at ${sourceMapLocation}`].join('\n')
      );

      return result;
    }

    const sources = sm.sources.map(stripProtocol);
    const sourceMap = new SourceMapConsumer(sm);

    const original = sourceMap.originalPositionFor({
      line: input.line,
      column: input.column
    });

    if (original && original.source) {
      const source = stripProtocol(original.source);
      const index = indexOfEndsWith(source, sources);

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

      const originalCode = sm.sourcesContent[index];

      result.code = originalCode;
      result.path = original.source;
      result.line = original.line;
      result.column = original.column;
    }
  }

  return result;
}

module.exports = {
  parseSourceMap
};
