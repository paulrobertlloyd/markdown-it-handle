const HANDLE_REGEXP = /@(?<user>[\w.%+-]+)@(?<host>[\w.-]+\.[a-z\d-]{2,})/gi;

/**
 * Replace handle with linked username
 *
 * @param {object} state - markdown-it state
 * @param {object} options - Plugin options
 */
export function replace (state, options) {
  const {tokens} = state;

  for (const token of tokens) {
    if (token.type !== 'inline') {
      continue;
    }

    const {children} = token;
    const newChildren = [];
    let insideLink = false;

    for (const child of children) {
      if (child.type === 'link_open') {
        insideLink = true;
        newChildren.push(child);
        continue;
      }

      if (child.type === 'link_close') {
        insideLink = false;
        newChildren.push(child);
        continue;
      }

      if (insideLink || child.type !== 'text') {
        newChildren.push(child);
        continue;
      }

      const {content} = child;
      let match;
      let lastIndex = 0;

      while ((match = HANDLE_REGEXP.exec(content)) !== null) {
        const {user, host} = match.groups;

        // Use prefixes defined in options
        let prefix;
        const {prefixes} = options;
        switch (prefixes[host]) {
          // No prefix given for host, assume `@`
          case undefined: {
            prefix = '@';
            break;
          }

          // Prefix explicitly given as not present, use ''
          case false: {
            prefix = '';
            break;
          }

          // Use prefix given for host
          default: {
            prefix = prefixes[host];
          }
        }

        // Prepend text found before match to new list of children
        if (match.index > lastIndex) {
          const beforeText = content.slice(lastIndex, match.index);
          newChildren.push({type: 'text', content: beforeText});
        }

        // Merge `href` attribute with attributes defined in options
        const attrs = {
          href: `https://${host}/${prefix}${user}`,
          ...options.attributes && options.attributes,
        };

        newChildren.push({
          type: 'link_open',
          tag: 'a',
          attrs: Object.entries(attrs),
        }, {
          type: 'text',
          content: `@${user}`,
        }, {
          type: 'link_close',
          tag: 'a',
          nesting: -1,
        });

        lastIndex = HANDLE_REGEXP.lastIndex;
      }

      if (lastIndex === 0) {
        // No matches, return unaltered child token
        newChildren.push(child);
      } else if (newChildren.length > 0 && lastIndex < content.length) {
        // Append text found after last match to list of new children
        const afterText = content.slice(lastIndex);
        newChildren.push({type: 'text', content: afterText});
      }
    }

    token.children = newChildren;
  }
};
