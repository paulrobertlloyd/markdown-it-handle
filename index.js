const replace = require('./lib/replace.js');
const prefixes = require('./lib/prefixes.js');

/**
 * Parse links to users on social networks using markdown-it
 *
 * @param {object} md - markdown-it instance
 * @param {object} [pluginOptions={}] - Plugin options
 */
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

  md.core.ruler.push('handle', state => replace(state, options));
};
