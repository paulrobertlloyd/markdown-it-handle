import { replace } from "./lib/replace.js";
import { prefixes } from "./lib/prefixes.js";

/**
 * Parse links to users on social networks using markdown-it
 * @param {object} md - markdown-it instance
 * @param {object} [pluginOptions] - Plugin options
 */
// eslint-disable-next-line unicorn/no-anonymous-default-export
export default function (md, pluginOptions = {}) {
  // Default plugin options
  const defaults = {
    attributes: {
      rel: "external",
    },
    prefixes,
  };

  // Merge options
  const options = { ...defaults, ...pluginOptions };

  md.core.ruler.push("handle", (state) => replace(state, options));
}
