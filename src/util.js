'use strict';

const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

module.exports.humanize = function humanize(arg0) {
  let num = arg0;

  if (!Number.isFinite(num)) {
    throw new TypeError(`Expected a finite number, got ${typeof num}: ${num}`);
  }

  const neg = num < 0;

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return `${(neg ? '-' : '') + num} B`;
  }

  const exponent = Math.min(Math.floor(Math.log10(num) / 3), UNITS.length - 1);
  // eslint-disable-next-line no-restricted-properties
  const numStr = Number((num / Math.pow(1000, exponent)).toPrecision(3));
  const unit = UNITS[exponent];

  return `${(neg ? '-' : '') + numStr} ${unit}`;
};

module.exports.promisify = function promisify(fn) {
  return function promise() {
    const args = Array.prototype.slice.call(arguments);

    return new Promise((resolve, reject) => {
      args.push((errOrResult, result) => {
        if (errOrResult instanceof Error) reject(errOrResult);
        if (errOrResult) return resolve(errOrResult);
        return resolve(result);
      });

      fn.apply(this, args);
    });
  };
};

module.exports.toKeyValueList = function toKeyValueList(object) {
  return Object.keys(object)
    .map(key => ({
      key,
      value: object[key] || ''
    }))
    .sort((a, b) => a.key.toLowerCase() > b.key.toLowerCase());
};
