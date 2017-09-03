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

module.exports = {
  stripProtocol,
  getLastLine
};
