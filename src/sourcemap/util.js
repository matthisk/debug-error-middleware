'use strict';

function stripProtocol(path) {
  const match = path.match(/^(\w+:\/\/).*/) || [];

  if (match && match.length) {
    return path.substring(match[1].length);
  }

  return path;
}

function getLastLine(input) {
  return input.substring(input.lastIndexOf('\n') + 1, input.length);
}

function indexOfEndsWith(source, sources) {
  let result = -1;

  sources.forEach((s, i) => {
    if (s.endsWith(source)) result = i;
  });

  return result;
}

module.exports = {
  stripProtocol,
  getLastLine,
  indexOfEndsWith
};
