const MENTION_REGEXP = /@(?<user>[\w.%+-]+)@(?<host>[\w.-]+\.[a-z\d-]{2,})/gi;

module.exports = function (state, options) {
  const {tokens} = state;

  for (const token of tokens) {
    if (token.type !== 'inline') {
      continue;
    }

    const {children} = token;

    if (children[0].type === 'link_open') {
      continue;
    }

    const newChildren = [];

    for (const child of children) {
      if (child.type !== 'text') {
        newChildren.push(child);
        continue;
      }

      const {content} = child;
      let match;
      let lastIndex = 0;

      while ((match = MENTION_REGEXP.exec(content)) !== null) {
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

        lastIndex = MENTION_REGEXP.lastIndex;
      }

      // Append text found after match to new list of children
      if (newChildren.length > 0 && lastIndex < content.length) {
        const afterText = content.slice(lastIndex);
        newChildren.push({type: 'text', content: afterText});
      }

      // No matches, return unaltered child token
      if (lastIndex === 0) {
        newChildren.push(child);
      }
    }

    token.children = newChildren;
  }
};
