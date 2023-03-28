'use strict';

const replace = require('./lib/replace.js');
const prefixes = require('./lib/prefixes.js');

module.exports = function (md, pluginOptions = {}) {
  // Default plugin options
  const defaults = {
    attributes: {
      rel: 'external',
    },
    prefixes,
  };

  // Merge options
  const options = {...defaults, ...pluginOptions};

  md.core.ruler.push('mentions', state => replace(state, options));
};
