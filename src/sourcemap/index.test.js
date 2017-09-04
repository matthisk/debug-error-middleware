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
      code: fileContent,
      column: 0,
      line: 3851,
      at: 'methodName'
    });

    expect(output.path).to.equal('webpack:///bin/koa-webpack.js');
    expect(output.line).to.equal(10);
  });
  it('transform stack (2)', () => {
    const output = parseSourceMap({
      path: sourcePath,
      code: fileContent,
      column: 0,
      line: 6540,
      at: 'methodName'
    });

    expect(output.path).to.equal(
      'webpack:///node_modules/koa-compose/index.js'
    );
    expect(output.line).to.equal(42);
  });
  it('transform stack (3)', () => {
    const output = parseSourceMap({
      path: sourcePath,
      code: fileContent,
      column: 0,
      line: 6541,
      at: 'methodName'
    });

    expect(output.path).to.equal(
      'webpack:///node_modules/koa-compose/index.js'
    );
    expect(output.line).to.equal(43);
  });
  it('transform stack (4)', () => {
    const output = parseSourceMap({
      path: sourcePath,
      code: fileContent,
      column: 0,
      line: 16968,
      at: 'methodName'
    });

    expect(output.path).to.equal('webpack:///src/middleware/koa.js');
    expect(output.line).to.equal(10);
  });
});
