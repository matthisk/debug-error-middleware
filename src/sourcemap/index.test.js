// input { lineStart: 3841,
//   lineNumber: 3851,
// }
// input { lineStart: 6530,
//   lineNumber: 6540,
// }
// input { lineStart: 6531,
//   lineNumber: 6541,
// }
// input { lineStart: 16958,
//   lineNumber: 16968,
// }
// input { lineStart: 3989,
//   lineNumber: 3999,
// }

const fs = require('fs');
const path = require('path');
const parseSourceMap = require('./index').parseSourceMap;
const expect = require('chai').expect;

describe('sourcemap support', () => {
  const sourcePath = path.join(__dirname, './data/koa-webpack.js');
  const fileContent = fs.readFileSync(sourcePath).toString();

  it('transform stack (1)', () => {
    const output = parseSourceMap({
      path: sourcePath,
      fileContent,
      column: 0,
      context: {
        lineStart: 3841,
        lineNumber: 3851
      }
    });

    expect(output.path).to.equal('webpack:///bin/koa-webpack.js');
    expect(output.context.lineNumber).to.equal(10);
    expect(output.context.lineStart).to.equal(0);
  });
  it('transform stack (2)', () => {
    const output = parseSourceMap({
      path: sourcePath,
      fileContent,
      column: 0,
      context: {
        lineStart: 6530,
        lineNumber: 6540
      }
    });

    expect(output.path).to.equal(
      'webpack:///node_modules/koa-compose/index.js'
    );
    expect(output.context.lineNumber).to.equal(42);
    expect(output.context.lineStart).to.equal(32);
  });
  it('transform stack (3)', () => {
    const output = parseSourceMap({
      path: sourcePath,
      fileContent,
      column: 0,
      context: {
        lineStart: 6531,
        lineNumber: 6541
      }
    });

    expect(output.path).to.equal(
      'webpack:///node_modules/koa-compose/index.js'
    );
    expect(output.context.lineNumber).to.equal(43);
    expect(output.context.lineStart).to.equal(33);
  });
  it('transform stack (4)', () => {
    const output = parseSourceMap({
      path: sourcePath,
      fileContent,
      column: 0,
      context: {
        lineStart: 16958,
        lineNumber: 16968
      }
    });

    expect(output.path).to.equal('webpack:///src/middleware/koa.js');
    expect(output.context.lineNumber).to.equal(10);
    expect(output.context.lineStart).to.equal(0);
  });
});
