const HANDLE_REGEXP = /(@(?<user>[\w.%+-]+))?@(?<host>[\w.-]+\.[a-z\d-]{2,})/gi;

/** @typedef {import('markdown-it/lib/rules_core/state_core.mjs').default} StateCore */
/** @typedef {import('markdown-it/lib/token.mjs').default} Token */
/** @typedef {import('markdown-it/lib/token.mjs').Nesting} Nesting */

/**
 * @typedef {object} PluginOptions
 * @property {boolean|object} [attributes] - Link attributes
 * @property {object} [prefixes] - Custom prefixes
 * @property {object} [atProto] - AT Protocol options
 */

/**
 * Create a new markdown-it Token
 * @param {StateCore} state - Markdown-it state
 * @param {string} type - Token type
 * @param {string} tag - HTML tag
 * @param {Nesting} nesting - Nesting level
 * @returns {Token} Created token
 */
function createToken(state, type, tag, nesting) {
  const Token = state.Token;
  return new Token(type, tag, nesting);
}

/**
 * Replace handle with linked username
 * @param {StateCore} state - State
 * @param {PluginOptions} options - Plugin options
 */
export function replace(state, options) {
  const { tokens } = state;

  for (const token of tokens) {
    if (token.type !== "inline") {
      continue;
    }

    const { children } = token;

    /** @type {Token[]} */
    const newChildren = [];

    let insideLink = false;
    for (const child of children) {
      if (child.type === "link_open") {
        insideLink = true;
        newChildren.push(child);
        continue;
      }

      if (child.type === "link_close") {
        insideLink = false;
        newChildren.push(child);
        continue;
      }

      if (insideLink || child.type !== "text") {
        newChildren.push(child);
        continue;
      }

      const { content } = child;
      let match;
      let lastIndex = 0;

      while ((match = HANDLE_REGEXP.exec(content)) !== null) {
        let { user, host } = match.groups;

        // AT Proto uses domain names as user names
        // So we’ll make the username this domain name
        // The host will be user’s chosen PDS (Personal Data Server)
        if (!user) {
          user = host;
          host = options.atProto?.app;
        }

        // Get prefix to show before username in basepath
        let prefix;
        const { prefixes } = options;
        switch (prefixes[host]) {
          // No prefix given for host, assume `@`
          case undefined: {
            prefix = "@";
            break;
          }

          // Prefix explicitly given as not present, use ''
          case false: {
            prefix = "";
            break;
          }

          // Use prefix given for host
          default: {
            prefix = prefixes[host];
          }
        }

        // Prepend text found before match to new list of children
        if (match.index > lastIndex) {
          const textToken = createToken(state, "text", "", 0);
          textToken.content = content.slice(lastIndex, match.index);
          newChildren.push(textToken);
        }

        // Merge `href` attribute with attributes defined in options
        const attributes = {
          href: `https://${host}/${prefix}${user}`,
          ...(options.attributes && options.attributes),
        };

        const linkOpenToken = createToken(state, "link_open", "a", 1);
        linkOpenToken.attrs = Object.entries(attributes);

        const textToken = createToken(state, "text", "", 0);
        textToken.content = `@${user}`;

        const linkCloseToken = createToken(state, "link_close", "a", -1);

        newChildren.push(linkOpenToken, textToken, linkCloseToken);

        lastIndex = HANDLE_REGEXP.lastIndex;
      }

      if (lastIndex === 0) {
        // No matches, return unaltered child token
        newChildren.push(child);
      } else if (newChildren.length > 0 && lastIndex < content.length) {
        // Append text found after last match to list of new children
        const textToken = createToken(state, "text", "", 0);
        textToken.content = content.slice(lastIndex);
        newChildren.push(textToken);
      }
    }

    token.children = newChildren;
  }
}
